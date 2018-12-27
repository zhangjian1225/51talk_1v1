var configData = {
	bg: './assets/images/bg.png',
	desc: 'Look, listen and choose',
	title: 'A single hand that wipes that come together to clap on success',
	tg: [{
		content:"eegeg appy family. My father i appy family. My father i",
		title:"1111111111111111111"
	},
	{
		content:"eegeg appy family. My father i appy family. My father i",
		title:"weqwf appy family. My father i"
	},
	{
		content:"eegeg appy family. My father i appy family. My father i",
		title:"weqwf appy family. My father i"
	}],
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
		// titleSecond: 'A single hand that wipes that come together to clap on success',
		items: [
			{
				img: './assets/images/item1.jpg',
				audio: '',
                pos: '左',
                isRight: 0
			},
			{
				img: './assets/images/item2.jpg',
				audio: '',
                pos: '右',
                isRight: 1
			}
		],
		rightItem: 0,
		example: './assets/images/exm.png',
		// example: '',
		text: '',
		// text: 'congratulations',
		audio: './audio/wrong.mp3'
	}
};
(function (pageNo) { configData.page = pageNo })(0)