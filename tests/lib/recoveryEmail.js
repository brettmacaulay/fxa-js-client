/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'intern!tdd',
  'intern/chai!assert',
  'tests/addons/environment'
], function (tdd, assert, Environment) {

  with (tdd) {
    suite('recoveryEmail', function () {
      var accountHelper;
      var respond;
      var mail;
      var client;
      var RequestMocks;
      var ErrorMocks;

      beforeEach(function () {
        var env = new Environment();
        accountHelper = env.accountHelper;
        respond = env.respond;
        mail = env.mail;
        client = env.client;
        RequestMocks = env.RequestMocks;
        ErrorMocks = env.ErrorMocks;
      });

      test('#recoveryEmailResendCode', function () {
        var user;

        return accountHelper.newUnverifiedAccount()
          .then(function (account) {
            user = account.input.user;

            return respond(client.recoveryEmailResendCode(account.signIn.sessionToken), RequestMocks.recoveryEmailResendCode)
          })
          .then(
          function(res) {
            assert.ok(res);

            return respond(mail.wait(user, 2), RequestMocks.resetMail);
          })
          .then(
            function (emails) {
              // second email, the code is resent.
              var code = emails[1].html.match(/code=([A-Za-z0-9]+)/)[1];
              assert.ok(code, "code is returned");
            },
            function() {
              assert.fail();
            }
          );
      });

    });
  }
});
