var
    gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    jshint = require('gulp-jshint'),
    exit = require('gulp-exit'),
    Q = require('q');

process.env.PORT = 4000;
process.env.MONGO_DEBUG = true;

gulp.task('setup-e2e-data', function(callback){
    var E2EData = require(__dirname + '/./e2e/data');
    E2EData.createTestData(function(err) {
        return callback(err);
    });
});

gulp.task('clear-e2e-data', function(callback){
    var E2EData = require(__dirname + '/./e2e/data');
    E2EData.clearDatabase(function(err){
        return callback(err).pipe(exit());
    });
});

gulp.task('start-server', function() {

  var
      app = require(__dirname + '/./app');
});

gulp.task('clean-populate', ['clear-e2e-data','setup-e2e-data']);
gulp.task('default', ['clear-e2e-data','setup-e2e-data', 'start-server']);
