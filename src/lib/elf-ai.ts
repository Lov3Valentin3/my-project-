import { getElf, type ElfProfile } from "@/lib/elves";
type Memory = { key: string; value: string };
type HistoryLetter = { fromRole: string; body: string };
type ChildBits = {
  firstName: string;
  age: number;
  favoriteColor: string;
  favoriteActivity: string;
  christmasWish?: string | null;
  birthday?: string | null;
};
const TOPIC_HINTS: { key: string; words: RegExp; memory?: string }[] = [
  { key: "reindeer", words: /reindeer|rudolph|dasher|dancer|prancer|vixen|comet|cupid|donner|blitzen/i },
  { key: "santa", words: /santa|mrs\.?\s*claus|father christmas/i },
  { key: "school", words: /school|teacher|homework|class/i },
  { key: "pet", words: /dog|cat|puppy|kitten|hamster|fish|pet/i, memory: "pet" },
  { key: "birthday", words: /birthday|i turn|turning \d/i, memory: "birthday" },
  { key: "wish", words: /i want|wish|please bring|for christmas i/i, memory: "wish" },
  { key: "sibling", words: /brother|sister|sibling/i, memory: "sibling" },
  { key: "snow", words: /snow|sled|ice|cold|winter/i },
  { key: "cookies", words: /cookie|bake|cake|cocoa|hot chocolate/i },
  { key: "toys", words: /toy|lego|doll|game|robot|bike/i, memory: "toy" },
  { key: "kindness", words: /helped|kind|share|friend|sorry/i },
  { key: "scared", words: /scared|afraid|worried|sad|lonely/i },
  { key: "joke", words: /joke|funny|laugh|pun/i },
];
function simpleWords(age: number, text: string) {
  if (age <= 5) {
    return text
      .replaceAll("magnificent", "super special")
      .replaceAll("extraordinary", "really wonderful")
      .replaceAll("imagination", "big thinking")
      .split(/(?<=[.!?])\s+/)
      .filter((s) => s.split(" ").length < 18)
      .join(" ");
  }
  return text;
}
function pick<T>(items: T[], seed: number) {
  return items[Math.abs(seed) % items.length];
}
function seedFrom(text: string) {
  return [...text].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
}
export function extractMemories(letter: string): Memory[] {
  const found: Memory[] = [];
  const pet = letter.match(
    /(?:my|our)\s+(dog|cat|puppy|kitten|hamster|fish|bunny|bird)\s+(?:is\s+)?(?:named|called)?\s*([A-Z][a-z]+)?/i,
  );
  if (pet) {
    found.push({
      key: "pet",
      value: pet[2] ? `${pet[1]} named ${pet[2]}` : pet[1],
    });
  }
  const wish = letter.match(
    /(?:i want|i wish for|please bring me|for christmas i want)\s+(.{3,60}?)(?:[.!?]|$)/i,
  );
  if (wish) found.push({ key: "wish", value: wish[1].trim() });
  const joke = letter.match(/knock knock[\s\S]{0,80}/i);
  if (joke) found.push({ key: "joke", value: joke[0].slice(0, 80) });
  const friend = letter.match(/my friend\s+([A-Z][a-z]+)/);
  if (friend) found.push({ key: "friend", value: friend[1] });
  return found;
}
function rememberedLine(memories: Memory[], elf: ElfProfile) {
  if (!memories.length) return "";
  const latest = memories[memories.length - 1];
  if (latest.key === "pet") {
    return `How is your ${latest.value}? I told the reindeer and they stamped a happy hoof.`;
  }
  if (latest.key === "wish") {
    return `I keep your wish for ${latest.value} on a sticky star above my workbench.`;
  }
  if (latest.key === "friend") {
    return `Say a sparkling hello to ${latest.value} from the North Pole.`;
  }
  if (latest.key === "joke") {
    return `I am still giggling about "${latest.value}". ${elf.catchphrase}`;
  }
  return `I still remember this: ${latest.value}.`;
}
function topicReply(letter: string, elf: ElfProfile, child: ChildBits) {
  const hits = TOPIC_HINTS.filter((topic) => topic.words.test(letter)).map((t) => t.key);
  const lines: string[] = [];
  if (hits.includes("reindeer")) {
    lines.push(
      elf.id === "willow" || elf.id === "holly"
        ? "The reindeer asked me to send you the softest nuzzle. Prancer even practiced a bow."
        : "I peeked into the stables and the bells on the harnesses rang like they knew your name.",
    );
  }
  if (hits.includes("santa")) {
    lines.push(
      "Santa walked by with a list as long as a sled and said, \"That child sounds wonderful.\" I agreed immediately.",
    );
  }
  if (hits.includes("school")) {
    lines.push(
      child.age <= 6
        ? "School days can feel big. I pack extra bravery in my mittens for you."
        : "Homework is like wrapping a tricky present — slow folds, then a proud bow.",
    );
  }
  if (hits.includes("scared")) {
    lines.push(
      "If a worry sneaks in, imagine I am sitting nearby with cocoa. We can be brave in tiny spoonfuls.",
    );
  }
  if (hits.includes("kindness")) {
    lines.push(
      "That kindness you shared? It showed up on the Nice List as a gold star that hummed.",
    );
  }
  if (hits.includes("cookies")) {
    lines.push(
      elf.id === "ginger" || elf.id === "cocoa" || elf.id === "holly"
        ? `I baked extra ${elf.favoriteTreat.toLowerCase()} after I read that. The kitchen smelled like a hug.`
        : "I snuck into the bakery and the cookies were still warm. I saved the thought of one for you.",
    );
  }
  if (hits.includes("joke") || elf.id === "jingle" || elf.id === "merry") {
    lines.push(
      pick(
        [
          "Knock knock. Who's there? Snow. Snow who? Snow use pretending we aren't best pals!",
          "What do you call an elf who tells secrets? A elf-whisperer. Okay, I am still workshopping that one.",
          "Why did the ornament go to school? To get a little brighter!",
        ],
        seedFrom(letter + elf.id),
      ),
    );
  }
  if (hits.includes("toys") || elf.christmasJob.toLowerCase().includes("toy")) {
    lines.push(
      `Over in ${elf.christmasJob} duty I thought of you while I worked. ${pick(elf.voice, seedFrom(letter))}`,
    );
  }
  if (!lines.length) {
    lines.push(pick(elf.voice, seedFrom(child.firstName + letter.slice(0, 12))));
  }
  return lines.slice(0, 2).join(" ");
}
function ageOpener(child: ChildBits, elf: ElfProfile) {
  if (child.age <= 5) {
    return `Hi ${child.firstName}! It is ${elf.name}. I am so happy you wrote to me.`;
  }
  if (child.age <= 8) {
    return `Dear ${child.firstName}, your letter landed on my bench with a tiny puff of snow. ${elf.greeting}`;
  }
  return `My dear friend ${child.firstName}, I read your letter twice by lantern light. ${elf.greeting}`;
}
export function composeElfLetter(input: {
  elfId: string;
  child: ChildBits;
  incoming: string;
  history: HistoryLetter[];
  memories: Memory[];
}) {
  const elf = getElf(input.elfId);
  const previousChildNotes = input.history
    .filter((letter) => letter.fromRole === "child")
    .slice(-3)
    .map((letter) => letter.body.slice(0, 80));
  const opener = ageOpener(input.child, elf);
  const personal = `I remember you love ${input.child.favoriteColor.toLowerCase()} and ${input.child.favoriteActivity.toLowerCase()}. That is such a ${input.child.favoriteColor.toLowerCase()} kind of joy.`;
  const topic = topicReply(input.incoming, elf, input.child);
  const memory = rememberedLine(input.memories, elf);
  const callback = previousChildNotes.length
    ? `Last time you told me something that still sits in my pocket like a warm stone.`
    : `This is the start of a real North Pole friendship, and I will keep every letter.`;
  const job = `Today at my job as ${elf.christmasJob} I thought, "${input.child.firstName} would love this."`;
  const wish = input.child.christmasWish
    ? `I keep your Christmas wish (${input.child.christmasWish}) tied with a ${input.child.favoriteColor.toLowerCase()} ribbon.`
    : "";
  const closer = `${elf.catchphrase} Write again soon — I will be right here in the snow glow.\n\nYour friend,\n${elf.name} ✨\n${elf.christmasJob}`;
  const body = [
    opener,
    "",
    topic,
    personal,
    memory,
    callback,
    job,
    wish,
    "",
    closer,
  ]
    .filter(Boolean)
    .join("\n\n");
  return simpleWords(input.child.age, body);
}
export function welcomeLetter(elf: ElfProfile, child: ChildBits) {
  return `Dear ${child.firstName},
${elf.greeting} My name is ${elf.name}, and I live at the North Pole where the snow sparkles like sugar. I just heard you chose me as your pen pal, and my hat nearly flew off with happiness.
I am ${elf.personality.split(".")[0].toLowerCase()}. My job is ${elf.christmasJob}, and when I am not working I love ${elf.hobbies.toLowerCase()}. If you ever visit (in your imagination counts!), I will share my favorite treat: ${elf.favoriteTreat.toLowerCase()}.
I already know you are ${child.age} and that you love ${child.favoriteColor.toLowerCase()} and ${child.favoriteActivity.toLowerCase()}. That tells me we will be wonderful friends.
Will you write back and tell me something about your world? A pet, a joke, a wish, or what the sky looks like from your window — I want to hear it all.
${elf.catchphrase}
Your new friend,
${elf.name}
North Pole Mail, Lane of Twinkling Pines`;
}
export function birthdayLetter(elf: ElfProfile, child: ChildBits) {
  return `Dear ${child.firstName},
Today the workshop bells rang in a special pattern — birthday pattern! I hung a ${child.favoriteColor.toLowerCase()} ribbon on my door and the reindeer hummed.
I hope your day feels as warm as cocoa and as bright as the aurora. ${elf.catchphrase}
With extra sparkles,
${elf.name}`;
}