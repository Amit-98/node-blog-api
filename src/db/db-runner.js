import { pool } from "./db-connect.js";

let SelectqueryS, SelectqueryM, InsertQuery, Updatequery, Deletequery, Transaction_query, InsertQueryErrorLog;

  const sql = pool;  

  SelectqueryS = (_query, cb) =>
  {
    sql.query(_query, (error, results) =>
    {
      if (error)
      {
        return cb(error);
      }
      if (results)
      {
        return cb(null, results[0]);
      }
      else
      {
        return cb(null, null);
      }
    });
  };

  SelectqueryM = (_query, cb) =>
  {
    sql.query(_query, (error, results) =>
    {
      if (error)
      {
        return cb(error);
      }
      if (results && results.length > 0)
      {
        return cb(null, results);
      }
      else
      {
        return cb(null, null);
      }
    });
  };

  InsertQuery = (_insertQuery, cb) =>
  {
    sql.query(_insertQuery, (error, results, fields) =>
    {
      if (error)
      {
        return cb(error);
      }
      if (results != null)
      {
        return cb(null, results);
      }
      else 
      {
        return cb(null, null);
      }
    });
  };

  Updatequery = (_updatequery, cb) =>
  {
    sql.query(_updatequery, (error, results, fields) =>
    {
      if (error)
      {
        return cb(error);
      }
      if (results.length > 0) 
      {
        cb(null, results);
      }
      else
      {
        cb(null, results);
      }
    });
  };

  Deletequery = (_deletequery, cb) =>
  {
    sql.query(_deletequery, (error, results, fields) =>
    {
      if (error) 
      {
        return cb(error);
      }
      if (results.length > 0)
      {
        cb(null, results);
      }
      if (results != null)
      {
        cb(null, results);
      }
      else
      {
        cb(null, null);
      }
    });
  };

  Transaction_query = (_query, cb) =>
  {

    sql.beginTransaction(function (err)
    {
      if (err)
      {
        return cb(err);
      }

      sql.query(_query, function (err, result)
      {
        if (err)
        {
          sql.rollback(function ()
          {
            //console.log("call",err);
            console.log("ROllback!");
            return cb(err);
          })
        }

        if (result != null && result != "")
        {
          sql.commit(function (err)
          {
            if (err)
            {
              sql.rollback(function ()
              {
                console.log("ROllback!");
                return cb(err);
              });
            }
            else
            {
              return cb(null, result);
            }
          })
        }

        sql.commit(function (err) 
        {
          if (err) 
          {
            sql.rollback(function ()
            {
              console.log("Rollback!");
              return cb(err);
            });
          }
        });
      })
    })
  }

  InsertQueryErrorLog = (_insertQuery) =>
  {
    sql.query(_insertQuery, (error, results, fields) =>
    {
      if (error)
      {

      }
      if (results != null) 
      {

      }
      else 
      {

      }
    });
  };

export default {
  SelectqueryS,
  SelectqueryM,
  InsertQuery,
  Updatequery,
  Deletequery,
  InsertQueryErrorLog,
  Transaction_query,
};

