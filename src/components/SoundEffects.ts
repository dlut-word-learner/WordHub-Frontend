import correctSoundRes from "../assets/audio/correct.wav";
import typingSoundRes from "../assets/audio/typing.wav";
import wrongSoundRes from "../assets/audio/wrong.wav";

export const correctSound = new Howl({ src: correctSoundRes });
export const wrongSound = new Howl({ src: wrongSoundRes });
export const typingSound = new Howl({ src: typingSoundRes });
