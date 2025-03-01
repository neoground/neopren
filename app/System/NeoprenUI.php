<?php
/**
 * This file contains the NeoprenUI class
 */

namespace Neopren\System;

use Carbon\Carbon;
use Charm\Vivid\C;

/**
 * Class NeoprenUI
 *
 * Providing PHP functionalities for the Neopren UI
 */
class NeoprenUI
{
    /**
     * Get the dynamic backgrounds data for light + dark mode for today
     *
     * @return array keys: light, dark. Each one contains an image data array with those keys:
     *               title, author, url, date, location, image_url, image_url_blur
     */
    public function getDynamicBackgrounds(): array
    {
        $now = Carbon::now();
        $dir = C::Router()->getAssetsUrl() . '/neopren/images/backgrounds';

        // Holidays
        $is_easter = false;
        if($now->month == 3 || $now->month == 4) {
            $easter = Carbon::createFromTimestamp(easter_date($now->year));
            $is_easter = $easter->isToday() || $easter->isYesterday() || $easter->isTomorrow();
        }

        $key = match (true) {
            $is_easter => 'easter',
            $now->month == 12 && in_array($now->day, [23, 24, 25, 26]) => 'christmas',
            ($now->month == 12 && $now->day > 29) || ($now->month == 1 && $now->day == 1) => 'newyear',
            default => $now->weekOfYear,
        };

        // Birthday
        if(C::has('Guard')) {
            $user = C::Guard()->getUser();
            if (property_exists('birthday', $user) && is_object($user->birthday)) {
                $birthday_month = $user->birthday->month;
                $birthday_day = $user->birthday->day;
                if (!empty($birthday_month) && !empty($birthday_day)
                    && $now->month == $birthday_month && $now->day == $birthday_day) {
                    $key = 'birthday';
                }
            }
        }

        // Override with week of year from request if available
        $key = C::Request()->get('woy', $key);

        $arr = [
            'light' => C::Config()->get('design:dynamic_backgrounds.light.' . $key),
            'dark' => C::Config()->get('design:dynamic_backgrounds.dark.' . $key),
        ];

        // Fallback images
        $arr['light'] ??= C::Config()->get('design:dynamic_backgrounds.light.53');
        $arr['dark'] ??= C::Config()->get('design:dynamic_backgrounds.dark.53');

        // Append URLs to images
        $arr['light']['image_url'] = "$dir/light_$key.webp";
        $arr['light']['image_url_blur'] = $dir . "/light_" . $key . "_blur.webp";
        $arr['dark']['image_url'] = "$dir/dark_$key.webp";
        $arr['dark']['image_url_blur'] = $dir . "/dark_" . $key . "_blur.webp";

        return $arr;
    }

}