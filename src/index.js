const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes/routes');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(cors())
//     credentials: true,
//     origin: ['http://localhost:3000', 'http://localhost']
// }));
app.use('/api', routes);


// const User = [
//   { id: 1, name: 'John Doe' },
//   { id: 2, name: 'Jane Doe' },
//   { id: 3, name: 'Bob Smith' },
// ];

// // GET user by ID
// app.get('/user/:id', async (req, res) => {
//   try {
//     const id = Number(req.params.id);
//     const user = User.find(user => user.id === id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });



app.listen(PORT, () => {
    console.log(`Authentication backend listening to port ${PORT}`);
});