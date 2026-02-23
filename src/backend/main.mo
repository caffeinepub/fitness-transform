import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import List "mo:core/List";

actor {
  include MixinStorage();

  // Theme logic
  type Theme = {
    name : Text;
    primaryColor : Text;
    secondaryColor : Text;
    accentColor : Text;
  };

  module Theme {
    public func default() : Theme {
      {
        name = "Default";
        primaryColor = "#FFFFFF";
        secondaryColor = "#000000";
        accentColor = "#FF0000";
      };
    };

    public func dark() : Theme {
      {
        name = "Dark";
        primaryColor = "#000000";
        secondaryColor = "#FFFFFF";
        accentColor = "#00FF00";
      };
    };
  };

  let themes = List.fromArray<Theme>([Theme.default(), Theme.dark()]);
  let userThemes = Map.empty<Principal, Theme>();

  public shared ({ caller }) func setTheme(themeName : Text) : async () {
    let found = themes.find(
      func(t) {
        t.name == themeName;
      }
    );
    switch (found) {
      case (?theme) {
        userThemes.add(caller, theme);
      };
      case (null) {
        userThemes.add(caller, Theme.default());
      };
    };
  };

  public query ({ caller }) func getTheme() : async Theme {
    switch (userThemes.get(caller)) {
      case (?theme) { theme };
      case (null) { Theme.default() };
    };
  };

  public shared ({ caller }) func uploadPhoto(photo : Storage.ExternalBlob) : async () {
    // Save the uploaded photo for future use by the frontend AI
    // Actual AI transformations will be handled by the client using external APIs
  };

  // Walk tracking
  type WalkSession = {
    steps : Nat;
    caloriesBurned : Nat;
    distanceInMeters : Float;
    durationInSeconds : Nat;
  };

  let walkData = Map.empty<Principal, List.List<WalkSession>>();

  public shared ({ caller }) func trackWalk(session : WalkSession) : async () {
    let sessions = switch (walkData.get(caller)) {
      case (null) {
        let newList = List.empty<WalkSession>();
        newList.add(session);
        newList;
      };
      case (?existingSessions) {
        existingSessions.add(session);
        existingSessions;
      };
    };
    walkData.add(caller, sessions);
  };

  public query ({ caller }) func getWalks() : async [WalkSession] {
    switch (walkData.get(caller)) {
      case (?sessions) {
        sessions.toArray().reverse();
      };
      case (null) {
        [];
      };
    };
  };

  public query ({ caller }) func getTotalSteps() : async Nat {
    switch (walkData.get(caller)) {
      case (?sessions) {
        let sessionsArray = sessions.toArray();
        var total = 0;
        for (session in sessionsArray.values()) {
          total += session.steps;
        };
        total;
      };
      case (null) { 0 };
    };
  };

  public query ({ caller }) func getTotalCalories() : async Nat {
    switch (walkData.get(caller)) {
      case (?sessions) {
        let sessionsArray = sessions.toArray();
        var total = 0;
        for (session in sessionsArray.values()) {
          total += session.caloriesBurned;
        };
        total;
      };
      case (null) { 0 };
    };
  };
};
