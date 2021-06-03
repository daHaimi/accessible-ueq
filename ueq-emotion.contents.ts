export enum UeqEmotionType {
  Short = 'Short',
  Full = 'Full'
}

export class UeqEmotionOptions {
  type: UeqEmotionType;
  language: string;
}

export const UeqContents = {
  [UeqEmotionType.Short]: [
    {
      name: 'support',
      low: 'obstructive',
      high: 'supportive'
    },
    {
      name: 'ease',
      low: 'complicated',
      high: 'easy'
    },
    {
      name: 'efficiency',
      low: 'inefficient',
      high: 'efficient'
    },
    {
      name: 'clarity',
      low: 'confusing',
      high: 'clear'
    },
    {
      name: 'excitement',
      low: 'boring',
      high: 'exciting'
    },
    {
      name: 'interest',
      low: 'not interesting',
      high: 'interesting'
    },
    {
      name: 'invention',
      low: 'conventional',
      high: 'inventive'
    },
    {
      name: 'novelty',
      low: 'usual',
      high: 'leading edge'
    }
  ]
};
