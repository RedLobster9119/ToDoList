
const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

//mySQLの設定
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'redlob',
    password: 'redlob',
    database: 'list_app'
});

//mySQLの接続確認
connection.connect((err) => {
    if (err) {
        console.log('error connecting: ' + err.stack);
        return;
    }
    console.log('success');
});


//TOPページ
app.get('/', (req, res) => {
    res.render('top.ejs');
});

//一覧ページ
app.get('/index', (req, res) => {
    connection.query(
        'SELECT * FROM items',
        (error, results) => {
            res.render('index.ejs', { items: results });
        }
    );
});

//追加ページ
app.get('/new', (req, res) => {
    res.render('new.ejs');
});

//新規作成
app.post('/create', (req, res) => {
    connection.query(
        'INSERT INTO items (name) VALUES (?)',
        [req.body.itemName],
        (error, results) => {
            res.redirect('/index');
        }
    );
});

//削除
app.post('/delete/:id', (req, res) => {
    connection.query(
        'DELETE FROM items WHERE id = ?',
        [req.params.id],
        (error, results) => {
            res.redirect('/index');
        }
    );
});

//編集
app.get('/edit/:id', (req, res) => {
    connection.query(
        'SELECT * FROM items WHERE id = ?',
        [req.params.id],
        (error, results) => {
            res.render('edit.ejs', { item: results[0] });
        }
    );
});

//更新
app.post('/update/:id', (req, res) => {
    connection.query(
        'UPDATE items SET name = ? WHERE id = ?',
       [req.body.itemName, req.params.id],
        (error, results) => {
            res.redirect('/index');
        }
    );
});

//localhost:3003/
app.listen(3003);
