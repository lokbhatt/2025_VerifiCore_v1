<?php

namespace App\Services;

use App\Models\Backend\ParentData\Municipality;
use Pratiksh\Nepalidate\Services\EnglishDate;
use Carbon\Carbon;

class OcrParserService
{
    public function extractFields(string $ocrText)
    {
        $text = preg_replace('/\s+/', ' ', $ocrText);
        $text = trim($text);

        // Convert Nepali digits → English digits
        $text = $this->convertNepaliDigits($text);

        $fields = [
            'citizenship_number'       => null,
            // 'name'                     => null,
            'dob'                      => null,
            'citizenship_issued_date'  => null,
            'citizenship_issued_date_ad'=> null,
            'citizenship_issued_place' => null,
            'citizenship_issued_by'    => null,
            'district'                 => null,
            'municipality'             => null,
            'ward'                     => null,
            'gender'                   => null,
        ];

        // Citizenship Number
        if (preg_match('/\d{2}[-\s]?\d{2}[-\s]?\d{2}[-\s]?\d{4,6}/', $text, $match)) {
            $fields['citizenship_number'] = str_replace(' ', '-', $match[0]);
        }


        // Date of Birth (AD)
        if (preg_match('/Year[:\s]*(\d{4}).*Month[:\s]*([A-Za-z]+).*Day[:\s]*(\d{1,2})/i', $text, $match)) {
            $fields['dob'] = "{$match[1]}-{$match[2]}-{$match[3]}";
        } elseif (preg_match('/DOB[:\s]+(\d{4}[-\/]\d{2}[-\/]\d{2})/i', $text, $match)) {
            $fields['dob'] = $this->normalizeDate($match[1]);
        }

        // Issued Date (BS)
        if (preg_match('/जारी\s*मिति[:\s]*([0-9\-]+)/u', $text, $match)) {
            $bsDate = $this->normalizeDate($match[1]);
            $fields['citizenship_issued_date'] = $bsDate;

            // Convert BS → AD
            try {
                $adDate = EnglishDate::create($bsDate)->toCarbon();
                $fields['citizenship_issued_date_ad'] = $adDate->format('Y-m-d');
            } catch (\Exception $e) {
                $fields['citizenship_issued_date_ad'] = null;
            }
        }

        // District
        if (preg_match('/District[:\s]*([A-Za-z]+)/i', $text, $match)) {
            $fields['district'] = trim($match[1]);
        } elseif (preg_match('/जिल्ला[:\s]*([^\s]+)/u', $text, $match)) {
            $fields['district'] = trim($match[1]);
        }

        // Municipality + Ward Extraction
        if (preg_match('/R\.?\s*M\.?\s*:\s*([A-Za-z]+).*?(?:Ward\s*No\.?\s*[:\-]?\s*(\d{1,2}))/i', $text, $match)) {
            // English: R.M. : Byans Ward No.4
            $fields['municipality'] = ucfirst(strtolower($match[1]));
            $fields['ward'] = $this->convertNepaliDigits($match[2]);
        } elseif (preg_match('/([^\s]+)\s*(नगरपालिका|गाउँपालिका|उपमहानगरपालिका|महानगरपालिका).*?(?:वडा\s*(?:नं|न\.|नं\.?)\s*[:\-]?\s*(\d{1,2}))/u', $text, $match)) {
            // Nepali: व्याँस गाउँपालिका वडा नं :४
            $fields['municipality'] = trim($match[1] . ' ' . $match[2]);
            $fields['ward'] = $this->convertNepaliDigits($match[3]);
        } else {
            // Fallback if municipality and ward are found separately
            if (preg_match('/R\.?\s*M\.?\s*:\s*([A-Za-z]+)/i', $text, $match)) {
                $fields['municipality'] = ucfirst(strtolower($match[1]));
            } elseif (preg_match('/([^\s]+)\s*(नगरपालिका|गाउँपालिका|उपमहानगरपालिका|महानगरपालिका)/u', $text, $match)) {
                $fields['municipality'] = trim($match[1] . ' ' . $match[2]);
            }

            if (preg_match('/Ward\s*No\.?\s*[:\-]?\s*(\d{1,2})/i', $text, $match)) {
                $fields['ward'] = $this->convertNepaliDigits($match[1]);
            } elseif (preg_match('/वडा\s*(?:नं|न\.|नं\.?)\s*[:\-]?\s*(\d{1,2})/u', $text, $match)) {
                $fields['ward'] = $this->convertNepaliDigits($match[1]);
            }
        }

        // Gender
        if (preg_match('/Sex[:\s]*(Male|Female|Other)/i', $text, $match)) {
            $fields['gender'] = ucfirst(strtolower($match[1]));
        } elseif (preg_match('/लिङ्ग[:\s]*(पुरुष|महिला|अन्य)/u', $text, $match)) {
            $map = ['पुरुष' => 'Male', 'महिला' => 'Female', 'अन्य' => 'Other'];
            $fields['gender'] = $map[$match[1]] ?? null;
        }

        // Issued By / Authority
        $fields['citizenship_issued_by'] = 'DOA';

        return $fields;
    }

    private function normalizeDate(string $rawDate): ?string
    {
        $rawDate = str_replace('/', '-', $rawDate);
        $formats = ['Y-m-d', 'd-m-Y', 'd-m-y'];

        foreach ($formats as $format) {
            $date = \DateTime::createFromFormat($format, $rawDate);
            if ($date) {
                return $date->format('Y-m-d');
            }
        }
        return $rawDate;
    }

    private function convertNepaliDigits(string $text): string
    {
        $nepaliDigits  = ['०','१','२','३','४','५','६','७','८','९'];
        $englishDigits = ['0','1','2','3','4','5','6','7','8','9'];
        return str_replace($nepaliDigits, $englishDigits, $text);
    }
}
