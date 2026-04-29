export type SignalKey = "webzen" | "ncsoft" | "nexon" | "krafton";

export type Signal = {
  name: string;
  greeting: string;
  emphasis: string[];
};

export const SIGNALS: Record<SignalKey, Signal> = {
  webzen: {
    name: "웹젠",
    greeting: "웹젠 미션 컨트롤로부터 신호를 수신했습니다",
    emphasis: ["narrative", "liveops"],
  },
  ncsoft: {
    name: "NCSOFT",
    greeting: "NCSOFT 미션 컨트롤로부터 신호를 수신했습니다",
    emphasis: ["system", "rpg"],
  },
  nexon: {
    name: "넥슨",
    greeting: "넥슨 미션 컨트롤로부터 신호를 수신했습니다",
    emphasis: ["liveops", "system"],
  },
  krafton: {
    name: "KRAFTON",
    greeting: "KRAFTON 미션 컨트롤로부터 신호를 수신했습니다",
    emphasis: ["narrative", "system"],
  },
};

export function getSignal(key: string | null): Signal | null {
  if (key === null) {
    return null;
  }

  if (Object.prototype.hasOwnProperty.call(SIGNALS, key)) {
    return SIGNALS[key as SignalKey];
  }

  console.warn("[signals] unknown signal key:", key);
  return null;
}
