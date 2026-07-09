<?php

namespace App\Services;

class PayUService
{
    protected $merchantKey;
    protected $salt;
    protected $payuUrl;

    public function __construct()
    {
        $this->merchantKey = config('services.payu.key');
        $this->salt = config('services.payu.salt');
        $this->payuUrl = config('services.payu.mode') === 'live'
            ? 'https://secure.payu.in/_payment'
            : 'https://test.payu.in/_payment';
    }

    public function generateHash($data)
    {
        // PayU Hash Sequence: key|txnid|amount|productinfo|firstname|email|udf1|udf2|...|salt
        $hashSequence = "{$this->merchantKey}|{$data['txnid']}|{$data['amount']}|{$data['productinfo']}|{$data['firstname']}|{$data['email']}|||||||||||{$this->salt}";

        return strtolower(hash('sha512', $hashSequence));
    }

    public function verifyHash($posted)
    {
        // Reverse Hash for security check
        
        $salt = $this->salt;
        $status = $posted['status'];
        $firstname = $posted['firstname'];
        $amount = $posted['amount'];
        $txnid = $posted['txnid'];
        $key = $posted['key'];
        $productinfo = $posted['productinfo'];
        $email = $posted['email'];

        $revHashSeq = "$salt|$status|||||||||||$email|$firstname|$productinfo|$amount|$txnid|$key";
        $calculatedHash = strtolower(hash('sha512', $revHashSeq));

        return $calculatedHash === $posted['hash'];
    }

    public function getPayUUrl()
    {
        return $this->payuUrl;
    }
}