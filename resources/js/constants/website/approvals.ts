/**
 * Approval Section Static Data
 */

export interface ApprovalDocument {
    title: string;
    date: string;
    size: string;
    url: string;
}

export interface ApprovalSection {
    id: string;
    name: string;
    shortName: string;
    description: string;
    fullDescription: string;
    icon: string;
    color: string;
    documents: ApprovalDocument[];
}

export const APPROVAL_SECTIONS: ApprovalSection[] = [
    {
        id: 'aishe',
        name: 'All India Survey on Higher Education',
        shortName: 'AISHE',
        description: 'Tracking the quality and performance of higher education institutions.',
        fullDescription: 'The All India Survey on Higher Education (AISHE) was established by the Ministry of Education to build a robust database and to assess the performance of higher education institutions in India. Our college actively participates in this survey, providing transparent data on students, faculty, and infrastructure.',
        icon: '📊',
        color: 'bg-primary/10 text-primary',
        documents: [
            { title: 'AISHE Certificate 2023-24', date: 'Jan 15, 2024', size: '1.2 MB', url: '#' },
            { title: 'Survey Report 2022-23', date: 'Mar 10, 2023', size: '2.5 MB', url: '#' },
        ]
    },
    {
        id: 'bseb',
        name: 'Bihar School Examination Board',
        shortName: 'BSEB',
        description: 'Intermediate and Secondary education approvals and certifications.',
        fullDescription: 'Affiliated with the Bihar School Examination Board (BSEB), our college provides quality intermediate education. This section contains official recognition letters and affiliation documents confirming our status as a registered institution for (+2) programs.',
        icon: '🏫',
        color: 'bg-emerald-500/10 text-emerald-500',
        documents: [
            { title: 'BSEB Affiliation Letter 2024', date: 'Feb 05, 2024', size: '1.5 MB', url: '#' },
            { title: 'Intermediate Recognition Certificate', date: 'Dec 20, 2023', size: '1.8 MB', url: '#' },
        ]
    },
    {
        id: 'naac',
        name: 'NAAC Accreditation',
        shortName: 'NAAC',
        description: 'National Assessment and Accreditation Council quality assurance reports.',
        fullDescription: 'The National Assessment and Accreditation Council (NAAC) is an autonomous body that assesses and accredits institutions of higher education in India. We are committed to maintaining the highest standards of academic excellence and institutional quality as reflected in our NAAC reports.',
        icon: '🎖️',
        color: 'bg-blue-500/10 text-blue-500',
        documents: [
            { title: 'NAAC Self Study Report (SSR)', date: 'Oct 12, 2023', size: '4.2 MB', url: '#' },
            { title: 'AQAR Report 2022-23', date: 'Aug 14, 2023', size: '2.1 MB', url: '#' },
            { title: 'Peer Team Visit Report', date: 'Nov 30, 2023', size: '3.6 MB', url: '#' },
        ]
    },
    {
        id: 'university',
        name: 'University Affiliation',
        shortName: 'University',
        description: 'Patliputra University affiliation and recognition documents.',
        fullDescription: 'As a constituent unit of Patliputra University, Patna, our college adheres to the academic guidelines and standards set by the university. This section lists the official university recognitions and letters that authorize our degree programs.',
        icon: '🏛️',
        color: 'bg-amber-500/10 text-amber-500',
        documents: [
            { title: 'University Recognition Letter', date: 'Jan 20, 2024', size: '1.1 MB', url: '#' },
            { title: 'Degree Course Authorization', date: 'May 15, 2023', size: '2.3 MB', url: '#' },
        ]
    },
    {
        id: 'other-bodies',
        name: 'Other Regulatory Bodies',
        shortName: 'Other Bodies',
        description: 'Approvals from UGC, State Government, and other authorities.',
        fullDescription: 'Beyond university and state boards, several other bodies oversee specific aspects of our operations. This includes internal quality cells, government grants, and special regulatory permissions from bodies like the UGC.',
        icon: '📂',
        color: 'bg-purple-500/10 text-purple-500',
        documents: [
            { title: 'UGC 2(f) & 12(B) Recognition', date: 'Jun 10, 2023', size: '1.4 MB', url: '#' },
            { title: 'State Govt. Grant Approval', date: 'Apr 22, 2023', size: '1.7 MB', url: '#' },
        ]
    },
];

export const ALL_APPROVALS = {
    aishe: [],
    bseb: [],
    naac: [],
    university: [],
    'other-bodies': [],
} as const;
