import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  // Theme logic (kept from original)
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
      func(t) { t.name == themeName }
    );
    switch (found) {
      case (?theme) { userThemes.add(caller, theme) };
      case (null) { userThemes.add(caller, Theme.default()) };
    };
  };

  public query ({ caller }) func getTheme() : async Theme {
    switch (userThemes.get(caller)) {
      case (?theme) { theme };
      case (null) { Theme.default() };
    };
  };

  // Customization options (new)
  type Customization = {
    fontSize : Nat;
    backgroundMusic : Text;
  };

  let customizations = Map.empty<Principal, Customization>();

  public shared ({ caller }) func setCustomizations(fontSize : Nat, backgroundMusic : Text) : async () {
    let customization = {
      fontSize;
      backgroundMusic;
    };
    customizations.add(caller, customization);
  };

  public query ({ caller }) func getCustomizations() : async Customization {
    switch (customizations.get(caller)) {
      case (?customization) { customization };
      case (null) {
        {
          fontSize = 16;
          backgroundMusic = "";
        };
      };
    };
  };

  public shared ({ caller }) func uploadPhoto(_photo : Storage.ExternalBlob) : async () {};

  // Walk tracking (kept from original)
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
      case (null) { [] };
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

  // DAILY TASKS (new)
  type Task = {
    id : Nat;
    description : Text;
    completed : Bool;
    category : Text;
  };

  type DailyRecord = {
    tasks : List.List<Task>;
    date : Time.Time;
    completed : Bool;
  };

  let taskData = Map.empty<Principal, List.List<DailyRecord>>();
  let nextTaskId = Map.empty<Principal, Nat>();

  func getNextTaskId(caller : Principal) : Nat {
    switch (nextTaskId.get(caller)) {
      case (?id) {
        nextTaskId.add(caller, id + 1);
        id;
      };
      case (null) {
        nextTaskId.add(caller, 1);
        0;
      };
    };
  };

  public query ({ caller }) func getDailyTasks() : async [Task] {
    let currentDay = Time.now() / (24 * 60 * 60 * 1000_000_000);

    switch (taskData.get(caller)) {
      case (null) {
        [
          {
            id = getNextTaskId(caller);
            description = "Walk a mile";
            completed = false;
            category = "Cardio";
          },
          {
            id = getNextTaskId(caller);
            description = "Run half a mile";
            completed = false;
            category = "Cardio";
          },
          {
            id = getNextTaskId(caller);
            description = "Do 20 squats";
            completed = false;
            category = "Lower Body";
          },
        ];
      };
      case (?records) {
        let todaysRecord = records.toArray().find(func(r) { r.date == currentDay });
        switch (todaysRecord) {
          case (?record) { record.tasks.toArray() };
          case (null) {
            [
              {
                id = getNextTaskId(caller);
                description = "Walk a mile";
                completed = false;
                category = "Cardio";
              },
              {
                id = getNextTaskId(caller);
                description = "Run half a mile";
                completed = false;
                category = "Cardio";
              },
              {
                id = getNextTaskId(caller);
                description = "Do 20 squats";
                completed = false;
                category = "Lower Body";
              },
            ];
          };
        };
      };
    };
  };

  public shared ({ caller }) func setTaskCompleted(taskId : Nat) : async Bool {
    let currentDay = Time.now() / (24 * 60 * 60 * 1000_000_000);

    let updatedRecords = switch (taskData.get(caller)) {
      case (null) { List.empty<DailyRecord>() };
      case (?records) {
        let todaysRecord = records.toArray().find(func(r) { r.date == currentDay });

        switch (todaysRecord) {
          case (null) { records };
          case (?record) {
            let updatedTasks = record.tasks.toArray().map(
              func(task) {
                if (task.id == taskId) {
                  { task with completed = true };
                } else { task };
              }
            );
            record.tasks.clear();
            for (task in updatedTasks.values()) {
              record.tasks.add(task);
            };
            records;
          };
        };
      };
    };
    taskData.add(caller, updatedRecords);
    true;
  };

  // Exercise category ideas (new)
  type Exercise = {
    name : Text;
    description : Text;
    category : Text;
  };

  let exercises = List.empty<Exercise>();
  let categoryMap = Map.empty<Text, List.List<Exercise>>();

  public query ({ caller }) func getExercisesByCategory(category : Text) : async [Exercise] {
    switch (categoryMap.get(category)) {
      case (null) { [] };
      case (?categoryExercises) {
        categoryExercises.toArray();
      };
    };
  };

  public shared ({ caller }) func addExercise(name : Text, description : Text, category : Text) : async () {
    let newExercise = { name; description; category };
    exercises.add(newExercise);

    let updatedCategoryExercises = switch (categoryMap.get(category)) {
      case (null) {
        let newList = List.empty<Exercise>();
        newList.add(newExercise);
        newList;
      };
      case (?existingCategoryExercises) {
        existingCategoryExercises.add(newExercise);
        existingCategoryExercises;
      };
    };
    categoryMap.add(category, updatedCategoryExercises);
  };

  // Function to set regular goals (new)
  type Goal = {
    description : Text;
    target : Int;
    progress : Int;
    completed : Bool;
  };

  let goals = Map.empty<Principal, List.List<Goal>>();

  public shared ({ caller }) func addGoal(description : Text, target : Int) : async () {
    let newGoal = {
      description;
      target;
      progress = 0;
      completed = false;
    };

    let updatedGoals = switch (goals.get(caller)) {
      case (null) {
        let newList = List.empty<Goal>();
        newList.add(newGoal);
        newList;
      };
      case (?existingGoals) {
        existingGoals.add(newGoal);
        existingGoals;
      };
    };
    goals.add(caller, updatedGoals);
  };

  public query ({ caller }) func getGoals() : async [Goal] {
    switch (goals.get(caller)) {
      case (null) { [] };
      case (?userGoals) {
        userGoals.toArray();
      };
    };
  };
};
