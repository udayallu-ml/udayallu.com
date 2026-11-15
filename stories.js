// Photo stories shown in the "Stories" section, newest first.
//
// To add a story:
// 1. Make a folder in stories/ (for example stories/maldives-2024/) and put the photos in it.
//    Use JPG or WebP, about 1600–2000px wide. Add a small "-thumb" copy (about 360px) for each.
// 2. Copy one of the blocks below to the top of the list and change the text.
//    "post" is optional: the page in posts/ that tells the full story.
// 3. Bump the ?v= number on stories.js in index.html so browsers load the new list.
window.STORIES = [
  {
    id: "r15-v3",
    title: "My first bike",
    subtitle: "Yamaha R15 V3",
    date: "Since 17 May 2019",
    place: "Bengaluru, India",
    text: "I brought home my Yamaha R15 V3 in Bengaluru on 17 May 2019. It was my first bike, and riding it has been one of my favourite things ever since. I haven't ridden much in the last three years, so this story is a reminder to get back on the road.",
    post: "posts/my-first-bike-r15-v3.html",
    photos: [
      { src: "stories/r15-v3/riding.webp", thumb: "stories/r15-v3/riding-thumb.webp", w: 2000, h: 1333,
        alt: "Uday Allu riding his blue Yamaha R15 V3, panning shot with a motion-blurred background", caption: "Out on the R15" },
      { src: "stories/r15-v3/lake.webp", thumb: "stories/r15-v3/lake-thumb.webp", w: 2000, h: 912,
        alt: "Uday Allu in a riding jacket by a lake surrounded by green hills", caption: "A stop by the lake" },
      { src: "stories/r15-v3/coast.webp", thumb: "stories/r15-v3/coast-thumb.webp", w: 1800, h: 1200,
        alt: "Uday Allu in a riding jacket looking out over the sea beside a rocky headland", caption: "Where the road meets the sea" }
    ]
  }
];
