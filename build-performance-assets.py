from __future__ import annotations

import re
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"

HOME_OVERRIDES = [
    "cta-overrides.css",
    "section-heading-overrides.css",
    "case-study-layout-overrides.css",
    "social-icons-overrides.css",
    "cta-arrow-overrides.css",
    "case-study-polish-overrides.css",
    "case-study-title-fix.css",
    "arabic-font-overrides.css",
    "section-title-line-fix.css",
    "section-title-line-position-fix.css",
    "section-heading-size-tweak.css",
    "section-heading-size-specific-fix.css",
    "identity-title-clipping-fix.css",
    "intro-first-screen-layout-fix.css",
    "identity-copy-button-polish.css",
    "case-study-image-button-alignment-fix.css",
    "social-icon-artwork-scale-fix.css",
    "case-study-frame-title-impact-fix.css",
    "explore-photo-navigation-fix.css",
    "intro-welcome-message.css",
    "intro-welcome-visibility-fix.css",
    "section-title-underline-removal.css",
    "ai-video-number-reel-style.css",
    "case-study-outer-frame-stability.css",
    "ai-overlay-bottom-gap-fix.css",
    "intro-welcome-position-impact-fix.css",
    "case-study-comfort-layout.css",
    "explore-about-section-navigation.css",
    "contact-email-single-line.css",
    "case-study-gradient-contrast.css",
    "about-portrait-seam-fix.css",
    "view-work-icon-polish.css",
    "client-performance-guard.css",
]

TRANSPARENT_WEBP = {
    "welcome-wave.png": "welcome-wave-opt.webp",
    "social-cv.png": "social-cv-opt.webp",
    "social-email.png": "social-email-opt.webp",
    "social-instagram.png": "social-instagram-opt.webp",
    "social-facebook.png": "social-facebook-opt.webp",
    "social-whatsapp.png": "social-whatsapp-opt.webp",
    "service-social-media.png": "service-social-media-opt.webp",
}

RESPONSIVE_IMAGES = [
    "reel-01-badr-thumbnail-new-opt.webp",
    "reel-02-physics-thumbnail-opt.webp",
    "reel-03-bimaristan-thumbnail-4x3-opt.webp",
    "reel-05-math-thumbnail-blue-opt.webp",
    "jacket-post-opt.webp",
    "dental-post-opt.webp",
    "jacket-fur-ad-opt.webp",
    "infinity-hydration-ad-opt.webp",
    "orovex-portfolio-card-opt.webp",
    "ai-listening-reading-thumb-opt.webp",
    "ai-different-places-thumb-opt.webp",
    "ai-riyad-bank-thumbnail-20260720-opt.webp",
    "case-study-video-editing-cover-opt.webp",
]

FONT_RE = re.compile(
    r"https://fonts\.googleapis\.com/css2\?family=Cairo:wght@400"
    r"(?:\.\.900|;500;600;700;800;900)"
    r"(?:(?:&|&amp;)family=Noto\+Kufi\+Arabic:wght@400;500;600;700;800;900)?"
    r"(?:(?:&|&amp;)family=Sora:wght@400\.\.800)?"
    r"(?:&|&amp;)display=swap"
)
FONT_URL = "https://fonts.googleapis.com/css2?family=Cairo:wght@400..900&amp;family=Sora:wght@400..800&amp;display=swap"


def minify_css(source: str) -> str:
    """Conservative CSS minifier that preserves quoted text and calc spacing."""
    out: list[str] = []
    index = 0
    quote: str | None = None
    escaped = False
    pending_space = False
    punctuation = "{}:;,>~"

    while index < len(source):
        char = source[index]

        if quote:
            out.append(char)
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
            index += 1
            continue

        if char in ('"', "'"):
            if pending_space and out and out[-1] not in punctuation:
                out.append(" ")
            pending_space = False
            quote = char
            out.append(char)
            index += 1
            continue

        if char == "/" and index + 1 < len(source) and source[index + 1] == "*":
            end = source.find("*/", index + 2)
            index = len(source) if end == -1 else end + 2
            continue

        if char.isspace():
            pending_space = True
            index += 1
            continue

        if char in punctuation:
            pending_space = False
            while out and out[-1] == " ":
                out.pop()
            if char == "}" and out and out[-1] == ";":
                out.pop()
            out.append(char)
            index += 1
            continue

        if pending_space and out and out[-1] not in punctuation and char not in punctuation:
            out.append(" ")
        pending_space = False
        out.append(char)
        index += 1

    return "".join(out).strip() + "\n"


def build_css() -> None:
    styles = (
        (ROOT / "styles.css").read_text(encoding="utf-8")
        + "\n"
        + (ROOT / "typography-system.css").read_text(encoding="utf-8")
        + "\n"
        + (ROOT / "english-bold-typography.css").read_text(encoding="utf-8")
        + "\n"
        + (ROOT / "infinity-before-showcase-impact.css").read_text(encoding="utf-8")
        + "\n"
        + (ROOT / "orovex-before-showcase-impact.css").read_text(encoding="utf-8")
    )
    (ROOT / "styles.min.css").write_text(minify_css(styles), encoding="utf-8", newline="\n")

    combined = "\n".join(
        (ROOT / name).read_text(encoding="utf-8") for name in HOME_OVERRIDES
    )
    (ROOT / "home-overrides.min.css").write_text(
        minify_css(combined), encoding="utf-8", newline="\n"
    )


def build_images() -> dict[str, tuple[int, int]]:
    for source_name, output_name in TRANSPARENT_WEBP.items():
        with Image.open(ASSETS / source_name) as image:
            image.save(
                ASSETS / output_name,
                "WEBP",
                lossless=True,
                method=6,
                exact=True,
            )

    responsive_dimensions: dict[str, tuple[int, int]] = {}
    for source_name in RESPONSIVE_IMAGES:
        source_path = ASSETS / source_name
        output_name = f"{source_path.stem}-mobile.webp"
        with Image.open(source_path) as image:
            image = image.convert("RGB")
            width = min(900, image.width)
            height = round(image.height * width / image.width)
            resized = image.resize((width, height), Image.Resampling.LANCZOS)
            resized.save(ASSETS / output_name, "WEBP", quality=82, method=6)
            responsive_dimensions[source_name] = (image.width, image.height)

    return responsive_dimensions


def add_intrinsic_dimensions(html: str) -> str:
    def update_tag(match: re.Match[str]) -> str:
        tag = match.group(0)
        if re.search(r"\swidth=", tag) or re.search(r"\sheight=", tag):
            return tag

        source_match = re.search(r'\ssrc="([^\"]+)"', tag)
        if not source_match:
            return tag

        source = source_match.group(1).split("?", 1)[0]
        if not source.startswith("./assets/"):
            return tag

        path = ROOT / source.removeprefix("./")
        if not path.exists():
            return tag

        try:
            with Image.open(path) as image:
                width, height = image.size
        except OSError:
            return tag

        return tag.replace("<img", f'<img width="{width}" height="{height}"', 1)

    return re.sub(r"<img\b[^>]*>", update_tag, html)


def add_responsive_sources(html: str, dimensions: dict[str, tuple[int, int]]) -> str:
    for source_name, (width, _) in dimensions.items():
        if "srcset=" in html and f"{Path(source_name).stem}-mobile.webp" in html:
            continue

        mobile_name = f"{Path(source_name).stem}-mobile.webp"
        source_pattern = re.compile(
            rf'(<img\b(?=[^>]*\bsrc="\./assets/{re.escape(source_name)}(?:\?[^\"]*)?")(?=[^>]*>)[^>]*>)'
        )

        def update_tag(match: re.Match[str]) -> str:
            tag = match.group(1)
            if "srcset=" in tag:
                return tag
            responsive = (
                f' srcset="./assets/{mobile_name} 900w, ./assets/{source_name} {width}w"'
                ' sizes="(max-width: 700px) calc(100vw - 2rem), '
                '(max-width: 1100px) 46vw, 38rem"'
            )
            closing = " />" if tag.endswith("/>") else ">"
            trimmed = tag[:-2].rstrip() if tag.endswith("/>") else tag[:-1].rstrip()
            return trimmed + responsive + closing

        html = source_pattern.sub(update_tag, html)
    return html


def update_html(responsive_dimensions: dict[str, tuple[int, int]]) -> None:
    for path in ROOT.glob("*.html"):
        html = path.read_text(encoding="utf-8")
        html = FONT_RE.sub(FONT_URL, html)
        html = html.replace('href="./styles.css"', 'href="./styles.min.css"')

        for source_name, output_name in TRANSPARENT_WEBP.items():
            html = html.replace(f"./assets/{source_name}", f"./assets/{output_name}")

        if path.name == "index.html":
            for name in HOME_OVERRIDES:
                html = re.sub(
                    rf'^\s*<link rel="stylesheet" href="\./{re.escape(name)}" />\s*$',
                    "",
                    html,
                    flags=re.MULTILINE,
                )

            bundle_link = '    <link rel="stylesheet" href="./home-overrides.min.css" />'
            if bundle_link not in html:
                html = html.replace(
                    '    <link rel="stylesheet" href="./styles.min.css" />',
                    '    <link rel="stylesheet" href="./styles.min.css" />\n' + bundle_link,
                    1,
                )
            html = add_responsive_sources(html, responsive_dimensions)

        html = add_intrinsic_dimensions(html)
        path.write_text(html, encoding="utf-8", newline="\n")


def main() -> None:
    build_css()
    responsive_dimensions = build_images()
    update_html(responsive_dimensions)


if __name__ == "__main__":
    main()
