//=========================================================
//router.js file
//Written By: Keegan Kerns
//Last Updated: Nov 27 2020
//Purpose: Router handles all interactions between the frontend and the server.
//         All Requests and Response Functions are called here.
//==========================================================

const bcrypt = require('bcrypt');
const session = require('express-session');


class Router{

  constructor(app, db){
    this.contactList(app, db);
    this.createLogin(app, db);
    this.delete(app, db);
    this.findID(app, db);
    this.getID(app, db);
    this.isLoggedIn(app, db);
    this.login(app,db);
    this.logout(app, db);
    this.manageAcct(app,db);
  }


  contactList(app, db){
    app.post('/contacts', (req, res) => {
      db.query('SELECT username FROM userData', (err, data, fields) => {
        if(data){
          res.json({
            success: true,
            users: data
          })
          return true;
        }
        else{
          res.json({
            sucess:false,
            msg: "Fail to access list"
          })
        }
      })
    })
  }//end of contactList


  createLogin(app, db){
    app.post('/createLogin', (req, res) => {
      let username = req.body.new_username;
      let password = req.body.new_password;
      let firstName = req.body.firstName;
      let lastName = req.body.lastName;
      let emailAddress = req.body.emailAddress;

      username = username.toLowerCase(); // validation restriction

      if(username.length > 20 || password.length > 20){
        res.json({
          success: false,
          msg: 'Error with username and password has occured'
        }) // simple server validation
        return;
      }

      password = bcrypt.hashSync(password, 9);

      let cols = {
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress
      }
      let ifExist = [username];
      db.query('SELECT * FROM userData WHERE username = ? LIMIT 1',ifExist, (err, data, fields) =>{

          if (err) {
            res.json({
              success: false,
              msg: 'Error accessing SQL DB'
            })
          return;
        }

        if(data && data.length === 1){
          res.json({
            success: false,
            msg: "User name already exists"
          })
        return;
      }

      db.query('INSERT INTO userData SET ?', cols, (error) => {
        if(error){
          res.json({
            success: false,
            msg: 'Error inserting into Database'
          });
          return;
        }
        else{
            res.json({
              success: true,
              msg: 'Login Created'
            })
            return;
          }
        });
      });
    }); //end of app.post
  }//end of create Login

  delete(app, db){
    app.post('/delete', (req, res) => {
      let id = req.session.userID;
      let cols = [id];
      db.query('DELETE FROM userData WHERE id = ? LIMIT 1', cols, (err, data, fields)=> {
        if(err){
          console.log(err);
          res.json({
            success: false,
            msg: "Failed to Delete Account"
          })
          return;
        }
        else{
          res.json({
            success: true,
            msg: "Account Deleted... Now logging out."
          })
          return;
        }
      })
    })
  }

  findID(app, db){
    app.post('/findID', (req, res) => {
      let recipient = req.body.recipient;
      let cols = [recipient];
      db.query('SELECT * FROM userData WHERE username = ? LIMIT 1', cols, (err, data, fields) =>{
        if(data && data.length === 1){
          res.json({
            success: true,
            username: data[0].username
          })
          return true;
        }else{
          res.json({
            success: false,
            msg: "User not found, Please check Spelling and try again"
          });
        }
      });

      })
   }//end of findID

   getID(app, db){
     app.post('/getID', (req, res) => {
       if(req.session.userID){
         let id = req.session.userID;
         res.json({
           success: true,
           id: id
         })
         return;
       }
       else{
         res.json({
           success: false
         })
         return;
       }

      })
    }//end of getID

  isLoggedIn(app, db){
    app.post('/isLoggedIn', (req, res) => {
      if(req.session.isLogIn){
        res.json({
          success:true
        })
      }
      else{
        res.json({
          success: false
        });
      }
    });
  }//end of logged in

  login(app, db){
    app.post('/login', (req, res) =>{
      let username = req.body.username;
      let password = req.body.password;

      username = username.toLowerCase(); // validation restriction

      if(username.length > 20 || password.length > 20){
        res.json({
          success: false,
          msg: 'Error with username and password has occured'
        }) // simple server validation
        return;
      }
      let cols = [username];
      db.query('SELECT * FROM userData WHERE username = ? LIMIT 1', cols, (err, data, fields) =>{

      if (err) {
        res.json({
          success: false,
          msg: 'Error accessing SQL DB'
        })
        return;
      }
      //found 1 user with this username
      if (data && data.length === 1){
        bcrypt.compare(password, data[0].password, (bcryptErr, verified) => {
          if(verified){
            req.session.userID = data[0].id;
            req.session.isLogIn = true;
            res.json({
              success: true,
              username: data[0].username
            })
            return;
          }
          else {
            res.json({
              success: false,
              msg: 'Invalid password'
            });
          }//end of else
        }); //end of bcrypt
      } else {
        res.json({
          success: false,
          msg: 'Username not found try again'
        });
      }//end of if data...
     }); // end of db query
    }); // end of app.post
   }//end of login

  logout(app, db){
    app.post('/logout', (req, res) => {
      if(req.session.userID){
        req.session.destroy();
        res.json({
          success: true,
        })
        return true;
      }else{
        res.json({
          success: false
        });
        return false;
      }
    });
  }//end of logout

manageAcct(app, db){
  app.post('/manageAcct', (req, res) => {
    let username = req.body.change_username;
    let password = req.body.change_password;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let emailAddress = req.body.emailAddress;
    let sessionID = req.session.userID;

  username = username.toLowerCase(); // validation restriction

  if(username.length > 20 || password.length > 20){
    res.json({
      success: false,
      msg: 'Error with username and password has occured'
    }) // simple server validation
    return;
  }

  password = bcrypt.hashSync(password, 9);

  let cols = [
    username,
    password,
    firstName,
    lastName,
    emailAddress,
    sessionID
  ]
  if(req.session.userID){
  db.query('UPDATE userData set username = ?, password =?, firstName =?, lastName= ?, emailAddress = ? WHERE id = ?', cols, (err, result) => {
    if(err){
      res.json({
        success: false,
        msg: 'Error occured while updating data'
      })
      return;
    }
    else{
      res.json({
        success: true,
        msg: 'Successfully updated...please login to apply changes.'
      });
      console.log(result);
      }
    })
  }else{
    res.json({
      success: false,
      msg: "Cannot update info"
    })
  }

    })
 }//end of manage Acct

}

module.exports = Router;
