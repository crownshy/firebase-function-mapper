var expect = require("chai").expect;
const mapper = require("../src/function-mapper.js");
const mapfile = __dirname.concat("/function-mapping.json");

describe("files specfied", () => {
  it("should read function names from files", function () {
    const filenames =
      "client/functions/lib/functions/on_firestore/on_discussion_thread_comment.dart client/functions/lib/functions/on_call/resolve_join_request.dart";
    const response = mapper.run(false, mapfile, filenames, "", "");
    expect(response).to.equal(
      "firebase deploy --only functions:DiscussionThreadCommentOnCreate,functions:DiscussionThreadCommentOnUpdate,functions:DiscussionThreadCommentOnDelete,functions:resolveJoinRequest"
    );
  });

  it("should add force option when specified", function () {
    const filenames =
      "client/functions/lib/functions/on_firestore/on_discussion_thread_comment.dart client/functions/lib/functions/on_call/resolve_join_request.dart";
    const response = mapper.run(true, mapfile, filenames, "", "");
    expect(response).to.equal(
      "firebase deploy --force --only functions:DiscussionThreadCommentOnCreate,functions:DiscussionThreadCommentOnUpdate,functions:DiscussionThreadCommentOnDelete,functions:resolveJoinRequest"
    );
  });
  // TODO no files behind --files, nonexistent filename, etc
});

describe("groups specfied", () => {
  it("should read function names from groups", function () {
    const groups = "discussion communities";
    const response = mapper.run(false, mapfile, "", groups, "");
    expect(response).to.equal(
      "firebase deploy --only functions:DiscussionThreadCommentOnCreate,functions:DiscussionThreadCommentOnUpdate,functions:DiscussionThreadCommentOnDelete,functions:resolveJoinRequest,functions:createJunto"
    );
  });

  it('should add force option when specified"', function () {
    const groups = "discussion communities";
    const response = mapper.run(true, mapfile, "", groups, "");
    expect(response).to.equal(
      "firebase deploy --force --only functions:DiscussionThreadCommentOnCreate,functions:DiscussionThreadCommentOnUpdate,functions:DiscussionThreadCommentOnDelete,functions:resolveJoinRequest,functions:createJunto"
    );
  });
  // TODO no groups behind --groups, nonexistent groupname, etc
});

describe("names specfied", () => {
  it("should build command from specified function names", function () {
    const names = "doTheThing doAnotherThing doAllTheThings";
    const response = mapper.run(false, mapfile, "", "", names);
    expect(response).to.equal(
      "firebase deploy --only functions:doTheThing,functions:doAnotherThing,functions:doAllTheThings"
    );
  });

  it("should add force option when specified", function () {
    const names = "doTheThing doAnotherThing doAllTheThings";
    const response = mapper.run(true, mapfile, "", "", names);
    expect(response).to.equal(
      "firebase deploy --force --only functions:doTheThing,functions:doAnotherThing,functions:doAllTheThings"
    );
  });
  // TODO no groups behind --groups, nonexistent groupname, etc
});

describe("nothing specfied", () => {
  it("should deploy all functions if no mapfile", function () {
    const response = mapper.run(false, "", "", "", "");
    expect(response).to.equal("firebase deploy --only functions");
  });

  it("should add force option when specified", function () {
    const response = mapper.run(true, "", "", "", "");
    expect(response).to.equal("firebase deploy --force --only functions");
  });

  it("should deploy in batches if mapfile given", function () {
    const response = mapper.run(false, mapfile, "", "", "");
    expect(response).to.equal(
      "firebase deploy --only functions:DiscussionThreadCommentOnCreate,functions:DiscussionThreadCommentOnUpdate,functions:DiscussionThreadCommentOnDelete;firebase deploy --only functions:resolveJoinRequest,functions:createJunto;firebase deploy --only functions:scheduleEvent"
    );
  });
  it("should force deploy in batches if mapfile given", function () {
    const response = mapper.run(true, mapfile, "", "", "");
    expect(response).to.equal(
      "firebase deploy --force --only functions:DiscussionThreadCommentOnCreate,functions:DiscussionThreadCommentOnUpdate,functions:DiscussionThreadCommentOnDelete;firebase deploy --force --only functions:resolveJoinRequest,functions:createJunto;firebase deploy --force --only functions:scheduleEvent"
    );
  });
});

describe("combo specfied", () => {
  it("should build command from two options", function () {
    const names = "doTheThing doAnotherThing doAllTheThings";
    const groups = "communities";
    const response = mapper.run(false, mapfile, "", groups, names);
    expect(response).to.equal(
      "firebase deploy --only functions:resolveJoinRequest,functions:createJunto,functions:doTheThing,functions:doAnotherThing,functions:doAllTheThings"
    );
  });

  it("should build command from all options", function () {
    const names = "doTheThing doAnotherThing doAllTheThings";
    const groups = "communities";
    const files =
      "client/functions/lib/functions/on_firestore/on_discussion_thread_comment.dart";
    const response = mapper.run(false, mapfile, files, groups, names);
    expect(response).to.equal(
      "firebase deploy --only functions:DiscussionThreadCommentOnCreate,functions:DiscussionThreadCommentOnUpdate,functions:DiscussionThreadCommentOnDelete,functions:resolveJoinRequest,functions:createJunto,functions:doTheThing,functions:doAnotherThing,functions:doAllTheThings"
    );
  });
});

describe("unexpected parameters", () => {});
