/* =========================================================
   Tailwind Custom Config — Jeevan Marg Palette
   ========================================================= */
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans:  ['"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
                serif: ['"Playfair Display"', 'serif'],
            },
            colors: {
                mint:   '#CDEBD6',
                cream:  '#FDFBF6',
                sage:   '#A9CDBA',
                beige:  '#E7D7C8',
                forest: '#3E5F55',
            },
            borderRadius: {
                'blob':         '40% 60% 70% 30% / 40% 50% 60% 50%',
                'blob-reverse': '60% 40% 30% 70% / 50% 60% 40% 50%',
            },
        },
    },
};