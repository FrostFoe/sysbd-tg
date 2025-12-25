export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export const groupMessagesByDate = (messages) => {
  const groups = {};
  const today = new Date().toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  messages.forEach((msg) => {
    const date = new Date(msg.$createdAt || msg.createdAt);
    let dateLabel = date.toLocaleDateString("en-US", { 
      weekday: "long", year: "numeric", month: "long", day: "numeric" 
    });

    if (date.toDateString() === today) dateLabel = "Today";
    else if (date.toDateString() === yesterdayStr) dateLabel = "Yesterday";

    if (!groups[dateLabel]) groups[dateLabel] = [];
    groups[dateLabel].push(msg);
  });
  return groups;
};

export const sanitizeText = (text) => {
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};
