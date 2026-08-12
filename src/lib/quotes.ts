export const DAILY_QUOTES = [
  { text: "Kindness is Christmas magic.", author: "Santa Claus" },
  { text: "Believe in the impossible.", author: "The North Pole" },
  { text: "Every act of kindness helps Santa.", author: "Mrs. Claus" },
  { text: "A warm heart can melt the coldest day.", author: "Elf Holly" },
  { text: "The best presents are the ones you give away.", author: "Jingle" },
  { text: "Look up. The sky is practicing wonder.", author: "Luna" },
  { text: "Gentle is a superpower.", author: "Willow" },
  { text: "You are one of a kind, just like a snowflake.", author: "Snowflake" },
  { text: "Little plans make big magic.", author: "Stella" },
  { text: "Stand tall and stay kind.", author: "Pine" },
  { text: "Giggle first, then everything else.", author: "Merry" },
  { text: "Warm hearts, warm hands.", author: "Cocoa" },
  { text: "Adventure is the best present.", author: "Dash" },
  { text: "You already have what you need inside.", author: "Pearl" },
  { text: "Shine like you mean it.", author: "Ruby" },
  { text: "Life's better with extra frosting.", author: "Ginger" },
  { text: "Every friend is a story worth telling.", author: "Noel" },
  { text: "Let's make it shine!", author: "Spark" },
  { text: "Growing kindness takes sunshine and time.", author: "Ivy" },
  { text: "Even the longest night keeps a lantern ready.", author: "Frost" },
  { text: "A letter can travel farther than a sleigh.", author: "The Mailroom Elves" },
  { text: "Sharing a cookie is a kind of spell.", author: "The Bakery" },
  { text: "The Nice List is written in everyday choices.", author: "Santa's Desk" },
  { text: "Hope is a lantern you can lend.", author: "Mrs. Claus" },
  { text: "If you can imagine it, the workshop can try it.", author: "Glimmer" },
  { text: "Music makes the snow fall softer.", author: "Bells" },
  { text: "Your smile is a decoration the world needs.", author: "Twinkle" },
  { text: "Courage can be as small as saying hello.", author: "Pearl" },
  { text: "Make room at the table. That's Christmas.", author: "Cocoa" },
  { text: "The North Pole believes in you.", author: "Santa Claus" },
  { text: "Wonder is a muscle. Use it daily.", author: "Luna" },
];
export function quoteForDate(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  return DAILY_QUOTES[day % DAILY_QUOTES.length];
}