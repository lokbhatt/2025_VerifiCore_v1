<?php

namespace App\Services;

use App\Models\Backend\ParentData\Municipality;
use Carbon\Carbon;

class KycValidationService
{
    public function levenshteinSimilarity(string $a, string $b): float
    {
        $levDistance = levenshtein($a, $b);
        $maxLength = strlen($a) + strlen($b);

        if ($maxLength === 0) return 1.0;
        return ($maxLength - $levDistance) / $maxLength;
    }

    public function jaroWinkler(string $s1, string $s2): float
    {
        $jaro = $this->jaro($s1, $s2);
        $prefixLength = $this->commonPrefixLength($s1, $s2);
        $scalingFactor = 0.1;

        return $jaro + ($prefixLength * $scalingFactor * (1 - $jaro));
    }

    protected function jaro(string $s1, string $s2): float
    {
        $s1_len = strlen($s1);
        $s2_len = strlen($s2);

        if ($s1_len === 0 && $s2_len === 0) return 1.0;
        if ($s1_len === 0 || $s2_len === 0) return 0.0;

        $match_distance = (int) floor(max($s1_len, $s2_len) / 2) - 1;

        $s1_matches = array_fill(0, $s1_len, false);
        $s2_matches = array_fill(0, $s2_len, false);

        $matches = $transpositions = 0;

        for ($i = 0; $i < $s1_len; $i++) {
            $start = max(0, $i - $match_distance);
            $end = min($i + $match_distance + 1, $s2_len);

            for ($j = $start; $j < $end; $j++) {
                if ($s2_matches[$j]) continue;
                if ($s1[$i] !== $s2[$j]) continue;

                $s1_matches[$i] = true;
                $s2_matches[$j] = true;
                $matches++;
                break;
            }
        }

        if ($matches === 0) return 0.0;

        $k = 0;
        for ($i = 0; $i < $s1_len; $i++) {
            if (!$s1_matches[$i]) continue;
            while (!$s2_matches[$k]) $k++;
            if ($s1[$i] !== $s2[$k]) $transpositions++;
            $k++;
        }

        return (1 / 3) * (
            $matches / $s1_len +
            $matches / $s2_len +
            ($matches - $transpositions / 2) / $matches
        );
    }

    protected function commonPrefixLength(string $s1, string $s2): int
    {
        $n = min(4, min(strlen($s1), strlen($s2)));
        $prefix = 0;

        for ($i = 0; $i < $n; $i++) {
            if ($s1[$i] !== $s2[$i]) break;
            $prefix++;
        }

        return $prefix;
    }

    public function dateDifferenceInDays(string $date1, string $date2)
    {
        try {
            $d1 = Carbon::parse($date1);
            $d2 = Carbon::parse($date2);
            return abs($d1->diffInDays($d2));
        } catch (\Exception $e) {
            return PHP_INT_MAX; // very high if parsing fails
        }
    }

    public function matches(array $ocrData, array $userData): array
    {
        $errors = [];

        // Name
        $userName = $this->normalizeName($userData['name'] ?? '');

        if (!$this->isValidName($userName)) {
            $errors['name'][] = 'Name format is invalid.';
        }

        if (!isset($ocrData['citizenship_number']) || $this->levenshteinSimilarity($ocrData['citizenship_number'], $userData['citizenship_number']) < 0.90) {
            $errors['citizenship_number'][] = 'Citizenship number mismatch.';
        }

        if (!isset($ocrData['dob']) || !isset($userData['dob'])) {
            $errors['dob'][] = 'Date of birth is missing.';
        } else {
            $dob = Carbon::parse($userData['dob']);
            $age = $dob->diffInYears(Carbon::now());

            if ($age < 16) {
                $errors['dob'][] = 'User must be at least 16 years old.';
            }

            if ($this->dateDifferenceInDays($ocrData['dob'], $userData['dob']) > 30) {
                $errors['dob'][] = 'Date of birth mismatch between document and user input.';
            }
        }


        // Issued Date
        if (!isset($ocrData['citizenship_issued_date']) || $this->dateDifferenceInDays($ocrData['citizenship_issued_date'], $userData['citizenship_issued_date']) > 30) {
            $errors['citizenship_issued_date'][] = 'Citizenship issued date mismatch.';
        }

        // Issued By (if available)
        if (!empty($userData['citizenship_issued_by']) && isset($ocrData['citizenship_issued_by'])) {
            if ($this->jaroWinkler($ocrData['citizenship_issued_by'], $userData['citizenship_issued_by']) < 0.85) {
                $errors['citizenship_issued_by'][] = 'Issued by always DOA.';
            }
        } elseif (!isset($ocrData['citizenship_issued_by'])) {
            $errors['citizenship_issued_by'][] = 'Issued by does not match.';
        }

        // District
        if (!isset($ocrData['district']) || $this->jaroWinkler($ocrData['district'], $userData['district']) < 0.85) {
            $errors['district_id'][] = 'District does not match.';
        }
        // Issued Place
        if (!isset($ocrData['citizenship_issued_place']) || $this->jaroWinkler($ocrData['citizenship_issued_place'], $userData['citizenship_issued_place']) < 0.85) {
            $errors['citizenship_issued_place'][] = 'Issued place does not match.';
        }

        // Municipality
    if (!isset($ocrData['municipality']) || $this->jaroWinkler($ocrData['municipality'], $userData['municipality']) < 0.85) {
        $errors['municipality_id'][] = 'Municipality does not match.';
    }

    // Ward
    if (isset($ocrData['ward']) && isset($userData['ward'])) {
    $wardOcr = (int) preg_replace('/\D/', '', $ocrData['ward']); 
    $wardUser = (int) preg_replace('/\D/', '', $userData['ward']);

    if ($wardOcr !== $wardUser) {
        $errors['ward_id'][] = "Ward does not match.";
    }
    } else {
        $errors['ward_id'][] = "Ward is missing.";
    }

    // Gender
    if (isset($ocrData['gender']) && isset($userData['gender'])) {
        $map = [
            'male'   => ['male', 'm', 'पुरुष'],
            'female' => ['female', 'f', 'महिला'],
            'other'  => ['other', 'o', 'अन्य'],
        ];

        $ocrGender = mb_strtolower(trim($ocrData['gender']));
        $userGender = mb_strtolower(trim($userData['gender']));

        $matched = false;
        foreach ($map as $std => $variants) {
            if (in_array($ocrGender, $variants) && in_array($userGender, $variants)) {
                $matched = true;
                break;
            }
        }

        if (!$matched) {
            $errors['gender_id'][] = 'Gender does not match.';
        }
    }


        return $errors;
    }

    private function normalizeName(string $name): string
    {
        // Split by whitespace, remove empty parts
        $parts = preg_split('/\s+/', trim($name));

        // Remove parts that are not purely alphabetic
        $parts = array_filter($parts, fn($w) => preg_match('/^[A-Za-z]+$/', $w));

        // Limit to max 3 parts (First, optional Middle, Last)
        $parts = array_slice($parts, 0, 3);

        // Capitalize each word properly
        $normalized = array_map(fn($w) => ucfirst(strtolower($w)), $parts);

        return implode(' ', $normalized);
    }

    /**
     * Validate if the normalized name looks like a real name:
     * - At least 2 characters per part
     * - At least 2 parts (First and Last)
     * - Each part starts with uppercase followed by lowercase
     */
    private function isValidName(string $name): bool
    {
        if (!$name) return false;

        $parts = explode(' ', $name);

        // Require 2 or 3 parts (First [Middle] Last)
        if (count($parts) < 2 || count($parts) > 3) {
            return false;
        }

        foreach ($parts as $part) {
            // Check length >= 2
            if (strlen($part) < 2) {
                return false;
            }

            // Check capitalization: first uppercase, rest lowercase
            if (!preg_match('/^[A-Z][a-z]+$/', $part)) {
                return false;
            }
        }

        return true;
    }

}
