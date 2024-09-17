var expect = require("chai").expect;
const mapper = require("../src/function-mapper.js");
const mapfile = __dirname.concat("/function-mapping.json");

afterEach(function () {
  process.argv = process.argv.slice(0, 2);
});

describe("files specfied", () => {
  beforeEach(function () {
    process.argv[2] = "--mapfile=".concat(mapfile);
  });

  it("should read function names from files", function () {
    process.argv[3] = "--files";
    process.argv[4] =
      "client/functions/lib/functions/on_firestore/on_discussion_thread_comment.dart";
    process.argv[5] =
      "client/functions/lib/functions/on_call/resolve_join_request.dart";
    const response = mapper.run();
    expect(response).to.equal(
      "deploy --only functions:DiscussionThreadCommentOnCreate,functions:DiscussionThreadCommentOnUpdate,functions:DiscussionThreadCommentOnDelete,functions:resolveJoinRequest"
    );
  });

  it("should add force option when specified", function () {
    process.argv[3] = "--files";
    process.argv[4] =
      "client/functions/lib/functions/on_firestore/on_discussion_thread_comment.dart";
    process.argv[5] =
      "client/functions/lib/functions/on_call/resolve_join_request.dart";
    process.argv[6] = "--force=true";
    const response = mapper.run();
    expect(response).to.equal(
      "deploy --force --only functions:DiscussionThreadCommentOnCreate,functions:DiscussionThreadCommentOnUpdate,functions:DiscussionThreadCommentOnDelete,functions:resolveJoinRequest"
    );
  });
  // TODO no files behind --files, nonexistent filename, etc
});

describe("groups specfied", () => {
  beforeEach(function () {
    process.argv[2] = "--mapfile=".concat(mapfile);
  });

  it("should read function names from groups", function () {
    process.argv[3] = "--groups";
    process.argv[4] = "discussion";
    process.argv[5] = "communities";
    const response = mapper.run();
    expect(response).to.equal(
      "deploy --only functions:DiscussionThreadCommentOnCreate,functions:DiscussionThreadCommentOnUpdate,functions:DiscussionThreadCommentOnDelete,functions:resolveJoinRequest,functions:createJunto"
    );
  });

  it('should add force option when specified"', function () {
    process.argv[3] = "--groups";
    process.argv[4] = "discussion";
    process.argv[5] = "communities";
    process.argv[6] = "--force=true";
    const response = mapper.run();
    expect(response).to.equal(
      "deploy --force --only functions:DiscussionThreadCommentOnCreate,functions:DiscussionThreadCommentOnUpdate,functions:DiscussionThreadCommentOnDelete,functions:resolveJoinRequest,functions:createJunto"
    );
  });
  // TODO no groups behind --groups, nonexistent groupname, etc
});

describe("names specfied", () => {
  it("should build command from specified function names", function () {
    process.argv[2] = "--names";
    process.argv[3] = "doTheThing";
    process.argv[4] = "doAnotherThing";
    process.argv[5] = "doAllTheThings";
    const response = mapper.run();
    expect(response).to.equal(
      "deploy --only functions:doTheThing,functions:doAnotherThing,functions:doAllTheThings"
    );
  });

  it("should add force option when specified", function () {
    process.argv[2] = "--names";
    process.argv[3] = "doTheThing";
    process.argv[4] = "doAnotherThing";
    process.argv[5] = "doAllTheThings";
    process.argv[6] = "--force=true";
    const response = mapper.run();
    expect(response).to.equal(
      "deploy --force --only functions:doTheThing,functions:doAnotherThing,functions:doAllTheThings"
    );
  });
  // TODO no groups behind --groups, nonexistent groupname, etc
});

describe("nothing specfied", () => {
  it("should deploy all functions if no mapfile", function () {
    const response = mapper.run();
    expect(response).to.equal("deploy --only functions");
  });

  it("should add force option when specified", function () {
    process.argv[2] = "--force=true";
    const response = mapper.run();
    expect(response).to.equal("deploy --force --only functions");
  });

  it("should deploy in batches if mapfile given", function () {
    process.argv[2] = "--mapfile=".concat(mapfile);
    const response = mapper.run();
    expect(response).to.equal(
      "deploy --only functions:DiscussionThreadCommentOnCreate,functions:DiscussionThreadCommentOnUpdate,functions:DiscussionThreadCommentOnDelete;firebase deploy --only functions:resolveJoinRequest,functions:createJunto;firebase deploy --only functions:scheduleEvent"
    );
  });
  it("should force deploy in batches if mapfile given", function () {
    process.argv[2] = "--mapfile=".concat(mapfile);
    process.argv[3] = "--force=true";
    const response = mapper.run();
    expect(response).to.equal(
      "deploy --force --only functions:DiscussionThreadCommentOnCreate,functions:DiscussionThreadCommentOnUpdate,functions:DiscussionThreadCommentOnDelete;firebase deploy --force --only functions:resolveJoinRequest,functions:createJunto;firebase deploy --force --only functions:scheduleEvent"
    );
  });
});

describe("combo specfied", () => {
  it("should build command from two options", function () {
    process.argv[2] = "--names";
    process.argv[3] = "doTheThing";
    process.argv[4] = "doAnotherThing";
    process.argv[5] = "doAllTheThings";
    process.argv[6] = "--groups";
    process.argv[7] = "communities";
    process.argv[8] = "--mapfile=".concat(mapfile);

    const response = mapper.run();
    expect(response).to.equal(
      "deploy --only functions:resolveJoinRequest,functions:createJunto,functions:doTheThing,functions:doAnotherThing,functions:doAllTheThings"
    );
  });

  it("should build command from all options", function () {
    process.argv[2] = "--names";
    process.argv[3] = "doTheThing";
    process.argv[4] = "doAnotherThing";
    process.argv[5] = "doAllTheThings";
    process.argv[6] = "--groups";
    process.argv[7] = "communities";
    process.argv[8] = "--mapfile=".concat(mapfile);
    process.argv[9] = "--files";
    process.argv[10] =
      "client/functions/lib/functions/on_firestore/on_discussion_thread_comment.dart";

    const response = mapper.run();
    expect(response).to.equal(
      "deploy --only functions:DiscussionThreadCommentOnCreate,functions:DiscussionThreadCommentOnUpdate,functions:DiscussionThreadCommentOnDelete,functions:resolveJoinRequest,functions:createJunto,functions:doTheThing,functions:doAnotherThing,functions:doAllTheThings"
    );
  });
});

describe("unexpected parameters", () => {});
