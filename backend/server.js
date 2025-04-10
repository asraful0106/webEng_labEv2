import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'webEng_labEval2'
});


const createTable = () => {
    const sql = `CREATE TABLE IF NOT EXISTS form_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        gender VARCHAR(50) NOT NULL,
        completed_courses TEXT NOT NULL,
        favorite_course VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    
    db.query(sql, (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Table form_submissions ready');
        }
    });
};


createTable();

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.post('/form', async (req, res) => {
    try {
        const { firstName, lastName, email, password, gender, completedCourses, favoriteCourse } = req.body;


        if (!firstName || !lastName || !email || !password || !gender || !completedCourses || !favoriteCourse) {
            return res.status(400).json({ error: 'All fields are required' });
        }

    
        const coursesString = completedCourses.join(',');

        const sql = `INSERT INTO form_submissions 
                    (first_name, last_name, email, password, gender, completed_courses, favorite_course) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        const values = [firstName, lastName, email, password, gender, coursesString, favoriteCourse];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to save form data' });
            }
            res.status(201).json({ 
                message: 'Form submitted successfully',
                id: result.insertId 
            });
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/form', async(req, res) =>{
    try {
        const sql = 'SELECT * FROM form_submissions';
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Database error:', err);
            }
            res.json(results);
        })
    }catch(err){
        console.error('Server error:', err);
    }
})

app.listen(PORT, () => console.log(`Server is running at PORT: ${PORT}`));
