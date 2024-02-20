// SPDX-FileCopyrightText: 2024 WordHub Organization <integral@member.fsf.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import correctSoundRes from "../assets/audio/correct.wav";
import typingSoundRes from "../assets/audio/typing.wav";
import wrongSoundRes from "../assets/audio/wrong.wav";

export const correctSound = new Howl({ src: correctSoundRes });
export const wrongSound = new Howl({ src: wrongSoundRes });
export const typingSound = new Howl({ src: typingSoundRes });
