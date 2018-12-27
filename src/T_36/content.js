
var configData = {
  bg: '',
	desc: 'eegeg appy family. My father',
	title: '',
  tg: [{
      content: "eegeg appy family. My father i appy family. My father i",
      title: "T118-------.0weqwf appy family. My father i"
    },
    {
      content: "eegeg appy family. My father i appy family. My father i",
      title: "weqwf appy family. My father i"
    },
    {
      content: "eegeg appy family. My father i appy family. My father i",
      title: "weqwf appy family. My father i"
    }
  ],
  level:{
		high:[{
			content: "eegeg appy family. My father i appy family. My father i",
			title: "weqwf appy family. My father i"
		},
		{
			content: "eegeg appy family. My father i appy family. My father i",
			title: "weqwf appy family. My father i"
		},
		{
			content: "eegeg appy family. My father i appy family. My father i",
			title: "weqwf appy family. My father i"
		}],
		low:[{
				content: "eegeg appy family. My father i appy family. My father i",
				title: "weqwf appy family. My father i"
			}]
	},
  source: {
    text: '',
    options: [{
        letter: [{ words: 'g', color: -1 }, { words: 'o', color: -1 }, { words: 'o', color: -1 }, { words: 'd', color: -1 }], //单词拆分
        wrongLetter: [{ interfere: '', wcolor: -1 }, { interfere: 'ea', wcolor: -1 }],
        recordStatus: false, //录音状态  true为添加录音按钮
        timeLong: '5', //录音时长
        words: 'good', //合并单词
        random: 0.3,
        audio: 'assets/audios/01.mp3',
      },
      {
        letter: [{ words: 'e', color: -1 }, { words: 'g', color: -1 }, { words: 'g', color: -1 }],
        wrongLetter: [{ interfere: 'a', wcolor: -1 }, { interfere: 'd', wcolor: -1 }],
        recordStatus: false,
        timeLong: '',
        words: 'egg',
        random: 0.6,
        audio: ''
      },
      {
        letter: [{ words: 'b', color: -1 }, { words: 'e', color: -1 }, { words: 'd', color: -1 }],
        wrongLetter: [{ interfere: 'a', wcolor: -1 }, { interfere: '', wcolor: -1 }],
        recordStatus: false,
        timeLong: '',
        words: 'bed',
        random: 0.5,
        audio: 'assets/audios/02.mp3'
      },
      {
        letter: [{ words: 't', color: -1 }, { words: 'e', color: -1 }, { words: 'a', color: -1 }],
        wrongLetter: [{ interfere: 'ea', wcolor: -1 }, { interfere: 'ds', wcolor: -1 }],
        recordStatus: false,
        timeLong: '3',
        words: 'tea',
        random: 0.7,
        audio: ''
      }, {
        letter: [{ words: 'm', color: -1 }, { words: 'a', color: -1 }, { words: 'th', color: -1 }, { words: 'er', color: -1 }],
        wrongLetter: [{ interfere: 'ea', wcolor: -1 }, { interfere: 'ds', wcolor: -1 }],
        recordStatus: false,
        timeLong: '',
        words: 'mather',
        random: 0.7,
        audio: ''
      }
    ],
  }
};