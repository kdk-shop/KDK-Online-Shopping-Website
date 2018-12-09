const app=require('./app');
const port =process.env.PORT || 4950;

app.listen(port,()=>console.log(`server running on port  ${port}`));

module.exports = app;
