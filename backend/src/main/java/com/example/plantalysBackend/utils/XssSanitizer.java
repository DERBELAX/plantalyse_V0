package com.example.plantalysBackend.utils;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.stereotype.Component;
@Component
public class XssSanitizer {
	public String sanitize(String input) {
        return input == null ? null : Jsoup.clean(input, Safelist.basic());
    }
}
