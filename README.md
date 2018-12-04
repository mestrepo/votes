# votes
Support promises.

Support Meteor methods.
At the moment, Meteor methods aren't working from resolver functions.
We can just call collection methods directly from resolver functions
since schema is doing GraphQL validation, and use Meteor methods on
the browser. Later, we can attempt using the swydo:ddp-apollo package
for both resolvers and browser.
