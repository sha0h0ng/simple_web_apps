module.exports = (done) => {
  console.log('Running Script 1');
  setTimeout(() => {
    console.log('Script 1 done');
    done();
  }, 5000); // Simulate async operation
};
