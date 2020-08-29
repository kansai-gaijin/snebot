const moment = require('moment');
moment.locale('ja');

const unknownMessage = [
  { type: 'text', text: '南河内リフォームにお問い合わせ頂きましてありがとうございます。地域に愛されるリフォーム業者を目指して、日々努力しております！今回のご相談内容について、1分で簡単診断を行いますのでご質問いお答えください。' },
  {
    "type": "flex",
    "altText": "Flex Message",
    "contents": {
      "type": "bubble",
      "body": {
        "type": "box",
        "layout": "vertical",
        "spacing": "md",
        "contents": [
          {
            "type": "text",
            "text": "今回のご相談内容は？",
            "size": "md",
            "gravity": "center",
            "weight": "bold",
            "wrap": true
          },
          {
            "type": "box",
            "layout": "vertical",
            "spacing": "md",
            "contents": [
              {
                "type": "button",
                "action": {
                  "type": "postback",
                  "label": "外壁塗装についての相談",
                  "data": "外壁塗装についての相談"
                },
                "style": "primary",
                "gravity": "top"
              },
              {
                "type": "button",
                "action": {
                  "type": "postback",
                  "label": "屋根工事についての相談",
                  "data": "屋根工事についての相談"
                },
                "style": "primary",
                "gravity": "center"
              },
              {
                "type": "button",
                "action": {
                  "type": "postback",
                  "label": "その他の相談",
                  "data": "その他の相談"
                },
                "style": "primary"
              }
            ]
          }
        ]
      }
    }
  }
];

const adviceTypeMessage = [
  {
    "type": "flex",
    "altText": "Flex Message",
    "contents": {
      "type": "bubble",
      "body": {
        "type": "box",
        "layout": "vertical",
        "spacing": "md",
        "contents": [
          {
            "type": "text",
            "text": "今回のご相談内容は？",
            "size": "md",
            "gravity": "center",
            "weight": "bold",
            "wrap": true
          },
          {
            "type": "box",
            "layout": "vertical",
            "spacing": "md",
            "contents": [
              {
                "type": "button",
                "action": {
                  "type": "postback",
                  "label": "お見積もりを依頼したい",
                  "data": "お見積もりを依頼したい"
                },
                "style": "primary",
                "gravity": "top"
              },
              {
                "type": "button",
                "action": {
                  "type": "postback",
                  "label": "無料診断を依頼したい",
                  "data": "無料診断を依頼したい"
                },
                "style": "primary",
                "gravity": "center"
              },
              {
                "type": "button",
                "action": {
                  "type": "postback",
                  "label": "電話で直接相談したい",
                  "data": "電話で直接相談したい"
                },
                "style": "primary"
              }
            ]
          }
        ]
      }
    }
  }
]

const callMessage = [
  {
    "type": "text",
    "text": "担当のスタッフが直接お答え致します！"
  },
  {
    "type": "flex",
    "altText": "Flex Message",
    "contents": {
      "type": "bubble",
      "direction": "ltr",
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "button",
            "action": {
              "type": "uri",
              "label": "お電話はこちら！",
              "uri": "tel:072-220-6893"
            },
            "style": "primary"
          }
        ]
      }
    }
  }
]

const inputSizeMessage = [
  {
    "type": "text",
    "text": "ご自宅の情報を記入してください。"
  },
  {
    "type": "text",
    "text": "建物の面積または坪数"
  }
]

const inputYearsMessage = [
  {
    "type": "text",
    "text": "建物の築年数"
  }
]

const inputNameMessage = [
  { type: 'text', text: '代表者の氏名を教えて下さい。' },
]

const inputNumberMessage = [
  { type: 'text', text: 'お電話番号を教えて下さい。' },
]

const resSuccess = [
  { type: 'text', text: 'ご記入頂き、ありがとうございます。弊社担当スタッフが直接ご対応いたしますのでしばらくお待ちください。' },
];


module.exports = {
  unknownMessage,
  adviceTypeMessage,
  callMessage,
  inputSizeMessage,
  inputYearsMessage,
  inputNameMessage,
  inputNumberMessage,
  resSuccess
};