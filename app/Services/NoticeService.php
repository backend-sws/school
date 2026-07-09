<?php

namespace App\Services;

use App\Models\LmsClass;
use App\Models\LmsClassEnrollment;
use App\Models\Notice;
use App\Models\NoticeTarget;
use App\Models\Stream;
use App\Models\User;
use App\Models\Session;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;


class NoticeService
{

    public function getNotices($request)
    {
        // dd($request->all());
        $perPage = $request->query('per_page', 10);
        $targetType = $request->query('target_type');
        $streamId = $request->query('stream');
        $sessionId = $request->query('session');

        // Eager load relationships
        $query = Notice::with(['targets.stream.mainStream', 'targets.session']);

        if ($targetType && $targetType !== 'all') {
            $query->where('target_type', $targetType);
        }

        if ($streamId) {
            $query->whereHas('targets', function ($q) use ($streamId) {
                $q->where('stream_id', $streamId);
            });
        }

        if ($sessionId) {
            $query->whereHas('targets', function ($q) use ($sessionId) {
                $q->where('session_id', $sessionId);
            });
        }

        $notices = $query->orderBy('created_at', 'desc')->paginate($perPage);

        $notices->getCollection()->transform(function ($notice) {
            // return targets as a comma separated string
            $noticeFor = 'All Students';

            if ($notice->target_type === 'selective') {
                $noticeFor = $notice->targets->map(function ($t) {
                    $mainStreamName = $t->stream->mainStream->name ?? '';
                    $streamName = $t->stream->name ?? '';
                    $sessionName = $t->session->name ?? '';

                    return trim("{$mainStreamName} {$streamName} ({$sessionName})");
                })->filter()->unique()->implode(', ');
            }


            return [
                'id' => $notice->id,
                'title' => $notice->title,
                'status' => $notice->is_published ? 'Published' : 'Draft',
                'published_on' => $notice->published_at ? \Carbon\Carbon::parse($notice->published_at)->format('d M Y') : 'Not Published',
                'notice_for' => $noticeFor,
            ];
        });

        return $notices;
    }

    public function createNotice($request): Notice
    {
        return DB::transaction(function () use ($request) {
            $notice = Notice::create([
                'title' => $request['title'],
                'description' => $request['description'] ?? null,
                'target_type' => $request['target_type'],
                'institution_id' => $request['institution_id'] ?? Notice::getActiveInstitutionId() ?? config('ems.default_institution_id'),
                'is_published' => $request['is_published'] ? true : false,
                'scheduled_at' => $request['scheduled_at'] ?? null,
                'expired_at' => $request['expired_at'] ?? null,
                'published_at' => $request['is_published'] ? now() : null,
                'final_publish' => $request['is_published'] ? true : false,
            ]);

            // Selective Combo Mapping
            if ($request['target_type'] === 'selective' && isset($request['combos'])) {
                foreach ($request['combos'] as $combo) {
                    NoticeTarget::create([
                        'notice_id' => $notice->id,
                        'stream_id' => $combo['stream_id'], // Direct column
                        'session_id' => $combo['session_id'], // Direct column
                    ]);
                }
            }

            return $notice;
        });
    }

    public function getNoticeById($id)
    {
        // return targets with combos
        $notice = Notice::with(['targets.stream', 'targets.session'])->findOrFail($id);

        return [
            'notice' => $notice,
            'combos' => $notice->targets->map(function ($t) {
                return [
                    'stream_id' => $t->stream_id,
                    'session_id' => $t->session_id
                ];
            })
        ];
    }

    public function updateNotice($id, array $data): Notice
    {
        return DB::transaction(function () use ($id, $data) {
            $notice = Notice::findOrFail($id);

            if ($notice->final_publish) {
                throw new \Exception("Final published notices cannot be edited.");
            }

            $notice->update([
                'title' => $data['title'],
                'description' => $data['description'] ?? $notice->description,
                'target_type' => $data['target_type'],
                'scheduled_at' => $data['scheduled_at'] ?? $notice->scheduled_at,
                'expired_at' => $data['expired_at'] ?? $notice->expired_at,
                'is_published' => $data['is_published'] ? true : false,
                'final_publish' => $data['is_published'] ? true : false
            ]);

            if ($data['target_type'] === 'selective') {
                $notice->targets()->delete();
                if (isset($data['combos'])) {
                    foreach ($data['combos'] as $combo) {
                        NoticeTarget::create([
                            'notice_id' => $id,
                            'stream_id' => $combo['stream_id'],
                            'session_id' => $combo['session_id'],
                        ]);
                    }
                }
            } else {
                $notice->targets()->delete();
            }

            return $notice;
        });
    }

    public function deleteNotice($id)
    {
        $notice = Notice::findOrFail($id);

        if ($notice->final_publish) {
            throw new \Exception("Final published notices cannot be deleted.");
        }

        return $notice->delete();
    }

    public function toggleIsPublished($id)
    {
        $notice = Notice::findOrFail($id);

        $notice->is_published = !$notice->is_published;

        if ($notice->is_published) {
            $notice->published_at = now();
            $notice->final_publish = true;
        } else {
            $notice->published_at = null;
        }

        $notice->save();

        return $notice;
    }

    /**
     * Get users to notify when a notice is published (for realtime/push).
     * - target_type "all": students enrolled in any class in the notice's institution.
     * - target_type "selective": students enrolled in classes matching notice targets (stream_id + session_id).
     *
     * @return Collection<int, User>
     */
    public function getNotifiableUsersForNotice(Notice $notice): Collection
    {
        $notice->loadMissing('targets');
        $institutionId = $notice->institution_id;
        if (! $institutionId) {
            return collect();
        }

        if ($notice->target_type === 'all') {
            $classIds = LmsClass::where('institution_id', $institutionId)->pluck('id');
            $userIds = LmsClassEnrollment::query()
                ->whereIn('lms_class_id', $classIds)
                ->where('role', 'student')
                ->where('status', 'active')
                ->distinct()
                ->pluck('user_id');
            return User::whereIn('id', $userIds)->get();
        }

        $targets = $notice->targets;
        if ($targets->isEmpty()) {
            return collect();
        }

        $classIds = LmsClass::query()
            ->where('institution_id', $institutionId)
            ->where(function ($q) use ($targets) {
                foreach ($targets as $t) {
                    $q->orWhere(fn ($q2) => $q2->where('stream_id', $t->stream_id)->where('session_id', $t->session_id));
                }
            })
            ->pluck('id');

        $userIds = LmsClassEnrollment::query()
            ->whereIn('lms_class_id', $classIds)
            ->where('role', 'student')
            ->where('status', 'active')
            ->distinct()
            ->pluck('user_id');

        return User::whereIn('id', $userIds)->get();
    }
}

