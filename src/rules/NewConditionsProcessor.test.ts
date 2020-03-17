import { RenderInteralFieldPath, RenderFieldList, RenderDocFieldPath, RenderField, RenderFields } from "./NewConditionsProcessor";

describe("RenderInteralFieldPath", () => {
  test("without params", () => {
    expect(RenderInteralFieldPath(["field", ["users", "userABC"]])).toBe(`.users.userABC`);
  });

  test("with params", () => {
    expect(RenderInteralFieldPath(["field", ["users", ["param", "uid"]]])).toBe(`.users[uid]`);
  });
});

describe("RenderFieldList", () => {
  test("no elements", () => {
    expect(RenderFieldList([])).toBe(`[]`);
  });

  test("only string elements", () => {
    expect(RenderFieldList(["elm1", "elm2"])).toBe(`["elm1","elm2"]`);
  });

  test("only number elements", () => {
    expect(RenderFieldList([0, 1, 2])).toBe(`[0,1,2]`);
  });

  test("mixed string and number elements", () => {
    expect(RenderFieldList([0, 1, 2, "abc", "efg"])).toBe(`[0,1,2,"abc","efg"]`);
  });
});

describe("RenderDocFieldPath", () => {
  test("without params", () => {
    expect(RenderDocFieldPath(["doc", ["users", "abc"], ["field", ["displayName"]]])).toBe(`get(/databases/$(database)/documents/users/abc).data.displayName`);
  });

  test("with params", () => {
    expect(RenderDocFieldPath(["doc", ["users", ["param", "uid"]], ["field", ["displayName"]]])).toBe(`get(/databases/$(database)/documents/users/$(uid)).data.displayName`);
  });
});

describe("RenderField", () => {
  describe("RenderDocFieldPath", () => {
    test("without params", () => {
      expect(RenderField(["doc", ["users", "abc"], ["field", ["displayName"]]])).toBe(`get(/databases/$(database)/documents/users/abc).data.displayName`);
    });
  
    test("with params", () => {
      expect(RenderField(["doc", ["users", ["param", "uid"]], ["field", ["displayName"]]])).toBe(`get(/databases/$(database)/documents/users/$(uid)).data.displayName`);
    });

  });
  
  describe("RenderInteralFieldPath", () => {
    test("without params", () => {
      expect(RenderField(["field", ["users", "userABC"]])).toBe(`.users.userABC`);
    });
  
    test("with params", () => {
      expect(RenderField(["field", ["users", ["param", "uid"]]])).toBe(`.users[uid]`);
    });
  });
});


describe("conditions.Boolean", () => {
  test("field", () => {
    expect(RenderFields(["field", ["map", "id"]])).toBe(`.map.id`);
  });
  
  test("document", () => {
    expect(RenderFields(["doc", ["collectionName", "docId"], ["field", ["fieldId", "id"]]])).toBe(`get(/databases/$(database)/documents/collectionName/docId).data.fieldId.id`);
  });
  
  test("document with params", () => {
    expect(RenderFields(["doc", ["collectionName", ["param", "uid"]], ["field", ["fieldId", "id"]]])).toBe(`get(/databases/$(database)/documents/collectionName/$(uid)).data.fieldId.id`);
  });
});

describe("conditions.Timestamp", () => {
  describe("withinRequest", () => {
    test("seconds", () => {
      expect(RenderFields([["field", ["map", "id"]], "withinRequest", "seconds", 5])).toBe(`(request.time.toMillis() - .map.id.seconds() * 1000) < duration.value(5, "s")`);
    });

    test("minutes", () => {
      expect(RenderFields([["field", ["map", "id"]], "withinRequest", "minutes", 5])).toBe(`(request.time.toMillis() - .map.id.seconds() * 1000) < duration.value(5, "m")`);
    });

    test("hours", () => {
      expect(RenderFields([["field", ["map", "id"]], "withinRequest", "hours", 5])).toBe(`(request.time.toMillis() - .map.id.seconds() * 1000) < duration.value(5, "h")`);
    });

    test("days", () => {
      expect(RenderFields([["field", ["map", "id"]], "withinRequest", "days", 5])).toBe(`(request.time.toMillis() - .map.id.seconds() * 1000) < duration.value(5, "d")`);
    });
  });
});

describe("conditions.Number", () => {
  describe("logic", () => {
    test("==", () => {
      expect(RenderFields([["field", ["map", "id"]], "==", 5])).toBe(`.map.id == 5`);
    });

    test("!==", () => {
      expect(RenderFields([["field", ["map", "id"]], "!==", 5])).toBe(`.map.id !== 5`);
    });

    test("<", () => {
      expect(RenderFields([["field", ["map", "id"]], "<", 5])).toBe(`.map.id < 5`);
    });

    test(">", () => {
      expect(RenderFields([["field", ["map", "id"]], ">", 5])).toBe(`.map.id > 5`);
    });

    test("<=", () => {
      expect(RenderFields([["field", ["map", "id"]], "<=", 5])).toBe(`.map.id <= 5`);
    });

    test(">=", () => {
      expect(RenderFields([["field", ["map", "id"]], ">=", 5])).toBe(`.map.id >= 5`);
    });
  });

  test("in", () => {
    expect(RenderFields([["field", ["map", "id"]], "in", [1,2,3]])).toBe(`.map.id in [1,2,3]`);
  });

  test("isInteger", () => {
    expect(RenderFields([["field", ["map", "id"]], "isInteger"])).toBe(`int(.map.id) === .map.id`);
  });

  test("isFloat", () => {
    expect(RenderFields([["field", ["map", "id"]], "isFloat"])).toBe(`float(.map.id) === .map.id`);
  });
});

describe("conditions.String", () => {
  describe("paramLogic", () => {
    test("==", () => {
      expect(RenderFields([["field", ["map", "id"]], "==", ["param", "uid"]])).toBe(`.map.id == uid`);
    });

    test("!==", () => {
      expect(RenderFields([["field", ["map", "id"]], "!==", ["param", "uid"]])).toBe(`.map.id !== uid`);
    });
  });

  describe("logic", () => {
    test("==", () => {
      expect(RenderFields([["field", ["map", "id"]], "==", "abc"])).toBe(`.map.id == "abc"`);
    });

    test("!==", () => {
      expect(RenderFields([["field", ["map", "id"]], "!==", "abc"])).toBe(`.map.id !== "abc"`);
    });
  });

  describe("size", () => {
    test("==", () => {
      expect(RenderFields([["field", ["map", "id"]], "size", "==", 5])).toBe(`.map.id.size() == 5`);
    });

    test("!==", () => {
      expect(RenderFields([["field", ["map", "id"]], "size", "!==", 5])).toBe(`.map.id.size() !== 5`);
    });

    test("<", () => {
      expect(RenderFields([["field", ["map", "id"]], "size", "<", 5])).toBe(`.map.id.size() < 5`);
    });

    test(">", () => {
      expect(RenderFields([["field", ["map", "id"]], "size", ">", 5])).toBe(`.map.id.size() > 5`);
    });

    test("<=", () => {
      expect(RenderFields([["field", ["map", "id"]], "size", "<=", 5])).toBe(`.map.id.size() <= 5`);
    });

    test(">=", () => {
      expect(RenderFields([["field", ["map", "id"]], "size", ">=", 5])).toBe(`.map.id.size() >= 5`);
    });
  });

  test("in", () => {
    expect(RenderFields([["field", ["map", "id"]], "in", ["ab","cd","ef"]])).toBe(`.map.id in ["ab","cd","ef"]`);
  });
});

describe("conditions.LatLng", () => {
  describe("distanceTo", () => {
    test("specfic latlng", () => {
      expect(RenderFields([["field", ["map", "id"]], "distanceTo", ["latlng", 51, 23], "==", 5])).toBe(`.map.id.distance(latlng.value(51, 23)) == 5`);
    });

    test("latlng from field", () => {
      expect(RenderFields([["field", ["map", "id"]], "distanceTo", ["field", ["map", "id"]], "==", 5])).toBe(`.map.id.distance(.map.id) == 5`);
    });

    test("latlng from doc field", () => {
      expect(RenderFields([["field", ["map", "id"]], "distanceTo", ["doc", ["users", "uid"], ["field", ["map", "id"]]], "==", 5])).toBe(`.map.id.distance(get(/databases/$(database)/documents/users/uid).data.map.id) == 5`);
    });
  });
});

describe("conditions.Map", () => {
  describe("size", () => {
    test("==", () => {
      expect(RenderFields([["field", ["map", "id"]], "size", "==", 5])).toBe(`.map.id.size() == 5`);
    });

    test("!==", () => {
      expect(RenderFields([["field", ["map", "id"]], "size", "!==", 5])).toBe(`.map.id.size() !== 5`);
    });

    test("<", () => {
      expect(RenderFields([["field", ["map", "id"]], "size", "<", 5])).toBe(`.map.id.size() < 5`);
    });

    test(">", () => {
      expect(RenderFields([["field", ["map", "id"]], "size", ">", 5])).toBe(`.map.id.size() > 5`);
    });

    test("<=", () => {
      expect(RenderFields([["field", ["map", "id"]], "size", "<=", 5])).toBe(`.map.id.size() <= 5`);
    });

    test(">=", () => {
      expect(RenderFields([["field", ["map", "id"]], "size", ">=", 5])).toBe(`.map.id.size() >= 5`);
    });
  });

  describe("get", () => {
    test("==", () => {
      expect(RenderFields([["field", ["map", "id"]], "get", "id", "==", 5])).toBe(`.map.id.id == 5`);
      expect(RenderFields([["field", ["map", "id"]], "get", ["param", "uid"], "==", 5])).toBe(`.map.id[uid] == 5`);

      expect(RenderFields([["field", ["map", "id"]], "get", "id", "==", "abc"])).toBe(`.map.id.id == "abc"`);
      expect(RenderFields([["field", ["map", "id"]], "get", ["param", "uid"], "==", "abc"])).toBe(`.map.id[uid] == "abc"`);
    });

    test("!==", () => {
      expect(RenderFields([["field", ["map", "id"]], "get", "id", "!==", 5])).toBe(`.map.id.id !== 5`);
      expect(RenderFields([["field", ["map", "id"]], "get", ["param", "uid"], "!==", 5])).toBe(`.map.id[uid] !== 5`);

      expect(RenderFields([["field", ["map", "id"]], "get", "id", "!==", "abc"])).toBe(`.map.id.id !== "abc"`);
      expect(RenderFields([["field", ["map", "id"]], "get", ["param", "uid"], "!==", "abc"])).toBe(`.map.id[uid] !== "abc"`);
    });

    test("<", () => {
      expect(RenderFields([["field", ["map", "id"]], "get", "id", "<", 5])).toBe(`.map.id.id < 5`);
      expect(RenderFields([["field", ["map", "id"]], "get", ["param", "uid"], "<", 5])).toBe(`.map.id[uid] < 5`);

      expect(RenderFields([["field", ["map", "id"]], "get", "id", "<", "abc"])).toBe(`.map.id.id < "abc"`);
      expect(RenderFields([["field", ["map", "id"]], "get", ["param", "uid"], "<", "abc"])).toBe(`.map.id[uid] < "abc"`);
    });

    test(">", () => {
      expect(RenderFields([["field", ["map", "id"]], "get", "id", ">", 5])).toBe(`.map.id.id > 5`);
      expect(RenderFields([["field", ["map", "id"]], "get", ["param", "uid"], ">", 5])).toBe(`.map.id[uid] > 5`);

      expect(RenderFields([["field", ["map", "id"]], "get", "id", ">", "abc"])).toBe(`.map.id.id > "abc"`);
      expect(RenderFields([["field", ["map", "id"]], "get", ["param", "uid"], ">", "abc"])).toBe(`.map.id[uid] > "abc"`);
    });

    test("<=", () => {
      expect(RenderFields([["field", ["map", "id"]], "get", "id", "<=", 5])).toBe(`.map.id.id <= 5`);
      expect(RenderFields([["field", ["map", "id"]], "get", ["param", "uid"], "<=", 5])).toBe(`.map.id[uid] <= 5`);

      expect(RenderFields([["field", ["map", "id"]], "get", "id", "<=", "abc"])).toBe(`.map.id.id <= "abc"`);
      expect(RenderFields([["field", ["map", "id"]], "get", ["param", "uid"], "<=", "abc"])).toBe(`.map.id[uid] <= "abc"`);
    });

    test(">=", () => {
      expect(RenderFields([["field", ["map", "id"]], "get", "id", ">=", 5])).toBe(`.map.id.id >= 5`);
      expect(RenderFields([["field", ["map", "id"]], "get", ["param", "uid"], ">=", 5])).toBe(`.map.id[uid] >= 5`);

      expect(RenderFields([["field", ["map", "id"]], "get", "id", ">=", "abc"])).toBe(`.map.id.id >= "abc"`);
      expect(RenderFields([["field", ["map", "id"]], "get", ["param", "uid"], ">=", "abc"])).toBe(`.map.id[uid] >= "abc"`);
    });
  });

  describe("keys", () => {
    test("hasAll", () => {
      expect(RenderFields([["field", ["map", "id"]], "keys", "hasAll", ["abc", "efg"]])).toBe(`.map.id.keys().hasAll(["abc","efg"])`);
    });

    test("hasAny", () => {
      expect(RenderFields([["field", ["map", "id"]], "keys", "hasAny", ["abc", "efg"]])).toBe(`.map.id.keys().hasAny(["abc","efg"])`);
    });

    test("hasOnly", () => {
      expect(RenderFields([["field", ["map", "id"]], "keys", "hasOnly", ["abc", "efg"]])).toBe(`.map.id.keys().hasOnly(["abc","efg"])`);
    });
  });

  describe("values", () => {
    test("hasAll", () => {
      expect(RenderFields([["field", ["map", "id"]], "values", "hasAll", ["abc", "efg"]])).toBe(`.map.id.values().hasAll(["abc","efg"])`);
      expect(RenderFields([["field", ["map", "id"]], "values", "hasAll", [0, 1]])).toBe(`.map.id.values().hasAll([0,1])`);
      expect(RenderFields([["field", ["map", "id"]], "values", "hasAll", [0, 1, "abc", "efg"]])).toBe(`.map.id.values().hasAll([0,1,"abc","efg"])`);
    });

    test("hasAny", () => {
      expect(RenderFields([["field", ["map", "id"]], "values", "hasAny", ["abc", "efg"]])).toBe(`.map.id.values().hasAny(["abc","efg"])`);
      expect(RenderFields([["field", ["map", "id"]], "values", "hasAny", [0, 1]])).toBe(`.map.id.values().hasAny([0,1])`);
      expect(RenderFields([["field", ["map", "id"]], "values", "hasAny", [0, 1, "abc", "efg"]])).toBe(`.map.id.values().hasAny([0,1,"abc","efg"])`);
    });

    test("hasOnly", () => {
      expect(RenderFields([["field", ["map", "id"]], "values", "hasOnly", ["abc", "efg"]])).toBe(`.map.id.values().hasOnly(["abc","efg"])`);
      expect(RenderFields([["field", ["map", "id"]], "values", "hasOnly", [0, 1]])).toBe(`.map.id.values().hasOnly([0,1])`);
      expect(RenderFields([["field", ["map", "id"]], "values", "hasOnly", [0, 1, "abc", "efg"]])).toBe(`.map.id.values().hasOnly([0,1,"abc","efg"])`);
    });
  });

  // describe("diff", () => {
  //   describe("addedKeys", () => {
  //     test("hasAll", () => {
  //       expect(RenderFields([["field", ["map", "id"]], "diff", "addedKeys", "hasAll", ["abc"]])).toBe(`.map.id.values().hasAll([\"abc\",\"efg\"])`);
  //     });

  //     test("hasAny", () => {
  //       expect(RenderFields([["field", ["map", "id"]], "diff", "addedKeys", "hasAny", ["abc"]])).toBe(`.map.id.values().hasAll(["abc","efg"])`);
  //     });

  //     test("hasOnly", () => {
  //       expect(RenderFields([["field", ["map", "id"]], "diff", "addedKeys", "hasOnly", ["abc"]])).toBe(`.map.id.values().hasAll(["abc","efg"])`);
  //     });
  //   });
  // });
});

// export type Map =
//   [Field, "diff", "addedKeys"|"effectedKeys"|"changedKeys"|"unchangedKeys", "hasAll"|"hasAny"|"hasOnly", string[]];



describe("List", () => {
  describe("size", () => {
    test("==", () => {
      expect(RenderFields([["field", ["map", "id"]], "size", "==", 5])).toBe(`.map.id.size() == 5`);
    });

    test("!==", () => {
      expect(RenderFields([["field", ["map", "id"]], "size", "!==", 5])).toBe(`.map.id.size() !== 5`);
    });

    test("<", () => {
      expect(RenderFields([["field", ["map", "id"]], "size", "<", 5])).toBe(`.map.id.size() < 5`);
    });

    test(">", () => {
      expect(RenderFields([["field", ["map", "id"]], "size", ">", 5])).toBe(`.map.id.size() > 5`);
    });

    test("<=", () => {
      expect(RenderFields([["field", ["map", "id"]], "size", "<=", 5])).toBe(`.map.id.size() <= 5`);
    });

    test(">=", () => {
      expect(RenderFields([["field", ["map", "id"]], "size", ">=", 5])).toBe(`.map.id.size() >= 5`);
    });
  });

  describe("get", () => {
    test("==", () => {
      expect(RenderFields([["field", ["map", "id"]], "get", 5, "==", 5])).toBe(`.map.id[5] == 5`);
      expect(RenderFields([["field", ["map", "id"]], "get", 5, "==", "abc"])).toBe(`.map.id[5] == "abc"`);
    });

    test("!==", () => {
      expect(RenderFields([["field", ["map", "id"]], "get", 5, "!==", 5])).toBe(`.map.id[5] !== 5`);
      expect(RenderFields([["field", ["map", "id"]], "get", 5, "!==", "abc"])).toBe(`.map.id[5] !== "abc"`);
    });

    test("<", () => {
      expect(RenderFields([["field", ["map", "id"]], "get", 5, "<", 5])).toBe(`.map.id[5] < 5`);
      expect(RenderFields([["field", ["map", "id"]], "get", 5, "<", "abc"])).toBe(`.map.id[5] < "abc"`);
    });

    test(">", () => {
      expect(RenderFields([["field", ["map", "id"]], "get", 5, ">", 5])).toBe(`.map.id[5] > 5`);
      expect(RenderFields([["field", ["map", "id"]], "get", 5, ">", "abc"])).toBe(`.map.id[5] > "abc"`);
    });

    test("<=", () => {
      expect(RenderFields([["field", ["map", "id"]], "get", 5, "<=", 5])).toBe(`.map.id[5] <= 5`);
      expect(RenderFields([["field", ["map", "id"]], "get", 5, "<=", "abc"])).toBe(`.map.id[5] <= "abc"`);
    });

    test(">=", () => {
      expect(RenderFields([["field", ["map", "id"]], "get", 5, ">=", 5])).toBe(`.map.id[5] >= 5`);
      expect(RenderFields([["field", ["map", "id"]], "get", 5, ">=", "abc"])).toBe(`.map.id[5] >= "abc"`);
    });
  });
  
  test("hasAll", () => {
    expect(RenderFields([["field", ["map", "id"]], "hasAll", ["abc", "efg"]])).toBe(`.map.id.set().hasAll(["abc","efg"])`);
    expect(RenderFields([["field", ["map", "id"]], "hasAll", [0, 1]])).toBe(`.map.id.set().hasAll([0,1])`);
    expect(RenderFields([["field", ["map", "id"]], "hasAll", [0, 1, "abc", "efg"]])).toBe(`.map.id.set().hasAll([0,1,"abc","efg"])`);
  });

  test("hasAny", () => {
    expect(RenderFields([["field", ["map", "id"]], "hasAny", ["abc", "efg"]])).toBe(`.map.id.set().hasAny(["abc","efg"])`);
    expect(RenderFields([["field", ["map", "id"]], "hasAny", [0, 1]])).toBe(`.map.id.set().hasAny([0,1])`);
    expect(RenderFields([["field", ["map", "id"]], "hasAny", [0, 1, "abc", "efg"]])).toBe(`.map.id.set().hasAny([0,1,"abc","efg"])`);
  });

  test("hasOnly", () => {
    expect(RenderFields([["field", ["map", "id"]], "hasOnly", ["abc", "efg"]])).toBe(`.map.id.set().hasOnly(["abc","efg"])`);
    expect(RenderFields([["field", ["map", "id"]], "hasOnly", [0, 1]])).toBe(`.map.id.set().hasOnly([0,1])`);
    expect(RenderFields([["field", ["map", "id"]], "hasOnly", [0, 1, "abc", "efg"]])).toBe(`.map.id.set().hasOnly([0,1,"abc","efg"])`);
  });
});

// export type ConditionGroup = {
//   operation: "&&"|"||",
//   conditions: (SingleCondition|ConditionGroup)[]
// };