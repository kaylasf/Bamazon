require('dotenv').config()
const inquirer = require('inquirer')
const { createConnection } = require('mysql2')
// const keys = require("./keys");


const db = createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})


// async function shop() {
//     getData()
//     productsArr = []
//     let res = await new Promise((res, rej) => {
//         db.query('SELECT * FROM products', (e, r) => {
//             if (e) {
//                 rej(e)
//             } else {
//                 r.forEach(product => {
//                     productsArr.push({
//                         'product': product.product_name,
//                         'department': product.department,
//                         'price': product.price
//                     })
//                 });
//                 // console.log(productsArr)
//                 prompt({
//                     type: 'list',
//                     name: 'choice',
//                     message: "Select an item you would like to purchase",
//                     choices: productsArr
//                 })

//             }
//         })
//     })
// }
// shop()




//updates database
const purchase = (id, amtBought) => {
    db.query(`SELECT * FROM products WHERE item_id = ${id}`, function (err, res) {
        if (err) { console.log(err) }
        if (amtBought <= res[0].stock_quantity) {
            let total = res[0].price * amtBought
            // console.log('its in stock')
            console.log(`We dont carry ${res[0].product_name}...NOOOT! Your total is $${total}`)

            db.query(`UPDATE products SET stock_quantity = stock_quantity - ${amtBought} WHERE item_id = ${id}`)
        }
        else {
            console.log('insufficient quantity! Naughty Naughty!')
        }
        inquirer
        .prompt([
            {
                name: 'choice',
                message: 'High Five! Would you like to buy another item?',
                type: 'rawlist',
                choices: ['yes-careful she bite', 'no']
            }
        ]).then(answer => {
            // console.log("action.choice" + answer.choice);
            // console.log('answer' + answer)
            if (answer.choice === 'yes-careful she bite') {
                shop();
              

            }
            else {
                console.log('Wawaweewa! Great Success! Bye Bye')
                process.exit();
                // shop()
            }
        })

    })
   

}

const shop = _ => {
    // getData() //all data is being brought in
    //push data into array 
    const productsArr = []

    db.query('SELECT * FROM products', function (err, res) {
        if (err) throw err
        // console.log(`THIS IS RES **** ${res}`);
        console.table(res);
        for (let i = 0; i < res.length; i++) {

            productsArr.push({
                'name': res[i].product_name,
                'value': res[i].item_id,
            })
        }

        // console.log(productsArr)
        inquirer
            .prompt([{
                name: 'choice',
                type: 'list',
                message: "Select an item you would like to purchase",
                choices: productsArr
            },
            {
                name: 'amount',
                type: 'input',
                message: 'Very Nice! How much?!'
            }
            ])
            //take chosen answer, check stock
            .then(answer => {
                let chosen;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].item_id === answer.choice) {
                        chosen = res[i]
                        // console.log(answer.amount)
                        // console.log('this is res[i]', res[i].product_name)
                    }
                }
                if (chosen.stock_quantity < answer.amount) {
                    // console.log('Sorry, this item is out of stock, Keep shopping!')
                    // shop()
                    purchase(chosen.item_id, answer.amount)
                    // purchase()
                } else {
                    // console.log(`you bought ${chosen.product_name}! Your total comes out to  $${chosen.price * answer.amount} good ol american US dollars`)
                    purchase(chosen.item_id, answer.amount)
                   
                }
            })
    })
}





// async function getData() {
//     let response = await new Promise((resolve, reject) => {
//         db.query('SELECT * FROM products', (e, r) => {
//             if (e) {
//                 reject(e)
//             } else {
//                 resolve(r)
//                 console.table(r)
//             }
//         })
//     })
//     return response
// }






//inquirer prompt
const getAction = _ => {
    inquirer
        .prompt({
            type: 'list',
            name: 'action',
            message: 'Would you like to shop or exit?',
            choices: ['Shop', 'Exit']
        })
        .then(({ action }) => {
            switch (action) {
                case 'Shop':
                    shop()
                    break
                case 'Exit':
                    process.exit()
                    break
                default:
                    getAction()
                    break
            }
        })
        .catch(e => console.log(e))
}

db.connect(e => e ? console.log(e) : getAction())


//shop is going to display all items and allow them to choose items, push price to array for total. 


//  1. function queries data, console table the data
// 2. 