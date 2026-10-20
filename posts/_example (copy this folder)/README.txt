HOW TO ADD A POST

1. Make a new folder on your computer. Name it with the date, then the title:
       2026-10-20 Why Sinner returns from so deep
2. Put your chart image(s) in it. PNG or JPG, any size; bigger is better.
   Videos work too. MP4 is safest; iPhone MOV files may not play in every browser.
   Everything appears in filename order, so number them: 1.png, 2.mp4, 3.png...
   The first IMAGE is always the thumbnail, even if a video comes before it.
   To put an image or video between paragraphs, write its filename on a line
   of its own in post.txt, e.g.  2.mp4
3. Copy post.txt from this folder into it and write your post.
4. Upload the folder to the posts folder on GitHub (drag and drop).
   The site updates by itself a couple of minutes later.
   GitHub's website takes files up to 25 MB. For bigger videos, use GitHub Desktop
   (up to 100 MB) or shrink the video first.

This example folder is ignored by the site because its name starts with _.

THE OPTIONAL LINES AT THE BOTTOM OF post.txt
   Tags:   usually not needed. Posts are tagged automatically from what they
           say (title, summary, writing and the Alt descriptions), using the topic
           list in src/lib/tags.ts: Serve +1, Serve speed, Return position,
           Rally length, Lefties, tournaments, players named in the title or
           summary, and so on. Add a Tags line only for something the text doesn't
           say. "Auto tags: no" switches automatic tagging off for a post.
   Data:   what the data covers, shown next to the chart.
   Alt:    a description of what the chart shows (Alt 2:, Alt 3: for further
           images). Worth writing properly: it feeds the automatic tags, Google
           Images, AI search and screen readers.
   Caption:  a line under the chart (Caption 2: ... for further images).
   Type: essay    marks a longer piece and shows a reading time.
   Pin: yes       puts the post first on the home page.
   Autoplay: yes  videos play silently on a loop (good for short animated charts).
   Hide: yes      takes it off the site without deleting it.
   X: https://x.com/...   links to where it was first posted.
   Date: 2026-10-20       only needed if the folder name has no date.
Leave out any you don't need.
