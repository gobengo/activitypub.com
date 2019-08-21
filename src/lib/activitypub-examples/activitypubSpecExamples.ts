// Examples from https://www.w3.org/TR/activitypub/

export const specExample2 = {
  "@context": "https://www.w3.org/ns/activitystreams",
  attributedTo: "https://social.example/alyssa/",
  content: "Say, did you finish reading that book I lent you?",
  to: ["https://chatty.example/ben/"],
  type: "Note",
};

export const specExample3 = {
  "@context": "https://www.w3.org/ns/activitystreams",
  actor: "https://social.example/alyssa/",
  id:
    "https://social.example/alyssa/posts/a29a6843-9feb-4c74-a7f7-081b9c9201d3",
  object: {
    attributedTo: "https://social.example/alyssa/",
    content: "Say, did you finish reading that book I lent you?",
    id:
      "https://social.example/alyssa/posts/49e2d03d-b53a-4c4c-a95c-94a6abf45a19",
    to: ["https://chatty.example/ben/"],
    type: "Note",
  },
  to: ["https://chatty.example/ben/"],
  type: "Create",
};

export const specExample4 = {
  "@context": "https://www.w3.org/ns/activitystreams",
  actor: "https://chatty.example/ben/",
  id: "https://chatty.example/ben/p/51086",
  object: {
    attributedTo: "https://chatty.example/ben/",
    content: `<p>Argh, yeah, sorry, I'll get it back to you tomorrow.</p>
                       <p>I was reviewing the section on register machines,
                          since it's been a while since I wrote one.</p>`,
    id: "https://chatty.example/ben/p/51085",
    inReplyTo:
      "https://social.example/alyssa/posts/49e2d03d-b53a-4c4c-a95c-94a6abf45a19",
    to: ["https://social.example/alyssa/"],
    type: "Note",
  },
  to: ["https://social.example/alyssa/"],
  type: "Create",
};

export const specExample5 = {
  "@context": "https://www.w3.org/ns/activitystreams",
  actor: "https://social.example/alyssa/",
  id:
    "https://social.example/alyssa/posts/5312e10e-5110-42e5-a09b-934882b3ecec",
  object: "https://chatty.example/ben/p/51086",
  to: ["https://chatty.example/ben/"],
  type: "Like",
};

export const specExample6 = {
  "@context": "https://www.w3.org/ns/activitystreams",
  actor: "https://social.example/alyssa/",
  id:
    "https://social.example/alyssa/posts/9282e9cc-14d0-42b3-a758-d6aeca6c876b",
  object: {
    attributedTo: "https://social.example/alyssa/",
    content:
      "Lending books to friends is nice.  Getting them back is even nicer! :)",
    id:
      "https://social.example/alyssa/posts/d18c55d4-8a63-4181-9745-4e6cf7938fa1",
    to: [
      "https://social.example/alyssa/followers/",
      "https://www.w3.org/ns/activitystreams#Public",
    ],
    type: "Note",
  },
  to: [
    "https://social.example/alyssa/followers/",
    "https://www.w3.org/ns/activitystreams#Public",
  ],
  type: "Create",
};

export const specOverSectionExampleConversation = [
  // specExample2 omitted because it's semantically the same as specExample3
  specExample3,
  specExample4,
  specExample5,
  specExample6,
];
