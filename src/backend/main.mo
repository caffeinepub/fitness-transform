import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";

import Bool "mo:core/Bool";

// Need data migration

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
  let userThemes = Map.empty<Text, Theme>();

  public shared ({ caller }) func setTheme(profileId : Text, themeName : Text) : async () {
    let found = themes.find(
      func(t) { t.name == themeName }
    );
    switch (found) {
      case (?theme) { userThemes.add(profileId, theme) };
      case (null) { userThemes.add(profileId, Theme.default()) };
    };
  };

  public query ({ caller }) func getTheme(profileId : Text) : async Theme {
    switch (userThemes.get(profileId)) {
      case (?theme) { theme };
      case (null) { Theme.default() };
    };
  };

  // Customization options (new)
  type Customization = {
    fontSize : Nat;
    backgroundMusic : Text;
  };

  let customizations = Map.empty<Text, Customization>();

  public shared ({ caller }) func setCustomizations(profileId : Text, fontSize : Nat, backgroundMusic : Text) : async () {
    let customization = {
      fontSize;
      backgroundMusic;
    };
    customizations.add(profileId, customization);
  };

  public query ({ caller }) func getCustomizations(profileId : Text) : async Customization {
    switch (customizations.get(profileId)) {
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

  // Walk tracking
  type WalkType = {
    #Tracked;
    #Recommended;
  };

  type WalkRating = {
    rating : Nat;
    completionTimestamp : Time.Time;
    walkType : WalkType;
  };

  type WalkSession = {
    steps : Nat;
    caloriesBurned : Nat;
    distanceInMeters : Float;
    durationInSeconds : Nat;
    rating : ?WalkRating;
  };

  let walkData = Map.empty<Text, List.List<WalkSession>>();

  public shared ({ caller }) func trackWalk(profileId : Text, session : WalkSession) : async () {
    let sessions = switch (walkData.get(profileId)) {
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
    walkData.add(profileId, sessions);
  };

  public query ({ caller }) func getWalks(profileId : Text) : async [WalkSession] {
    switch (walkData.get(profileId)) {
      case (?sessions) {
        sessions.toArray().reverse();
      };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getTotalSteps(profileId : Text) : async Nat {
    switch (walkData.get(profileId)) {
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

  public query ({ caller }) func getTotalCalories(profileId : Text) : async Nat {
    switch (walkData.get(profileId)) {
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

  let taskData = Map.empty<Text, List.List<DailyRecord>>();
  let nextTaskId = Map.empty<Text, Nat>();

  func getNextTaskId(profileId : Text) : Nat {
    switch (nextTaskId.get(profileId)) {
      case (?id) {
        nextTaskId.add(profileId, id + 1);
        id;
      };
      case (null) {
        nextTaskId.add(profileId, 1);
        0;
      };
    };
  };

  public query ({ caller }) func getDailyTasks(profileId : Text) : async [Task] {
    let currentDay = Time.now() / (24 * 60 * 60 * 1000_000_000);

    switch (taskData.get(profileId)) {
      case (null) {
        [
          {
            id = getNextTaskId(profileId);
            description = "Walk a mile";
            completed = false;
            category = "Cardio";
          },
          {
            id = getNextTaskId(profileId);
            description = "Run half a mile";
            completed = false;
            category = "Cardio";
          },
          {
            id = getNextTaskId(profileId);
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
                id = getNextTaskId(profileId);
                description = "Walk a mile";
                completed = false;
                category = "Cardio";
              },
              {
                id = getNextTaskId(profileId);
                description = "Run half a mile";
                completed = false;
                category = "Cardio";
              },
              {
                id = getNextTaskId(profileId);
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

  public shared ({ caller }) func setTaskCompleted(profileId : Text, taskId : Nat) : async Bool {
    let currentDay = Time.now() / (24 * 60 * 60 * 1000_000_000);

    let updatedRecords = switch (taskData.get(profileId)) {
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
    taskData.add(profileId, updatedRecords);
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

  public query ({ caller }) func getExercisesByCategory(_profileId : Text, category : Text) : async [Exercise] {
    switch (categoryMap.get(category)) {
      case (null) { [] };
      case (?categoryExercises) {
        categoryExercises.toArray();
      };
    };
  };

  public shared ({ caller }) func addExercise(_profileId : Text, name : Text, description : Text, category : Text) : async () {
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

  let goals = Map.empty<Text, List.List<Goal>>();

  public shared ({ caller }) func addGoal(profileId : Text, description : Text, target : Int) : async () {
    let newGoal = {
      description;
      target;
      progress = 0;
      completed = false;
    };

    let updatedGoals = switch (goals.get(profileId)) {
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
    goals.add(profileId, updatedGoals);
  };

  public query ({ caller }) func getGoals(profileId : Text) : async [Goal] {
    switch (goals.get(profileId)) {
      case (null) { [] };
      case (?userGoals) {
        userGoals.toArray();
      };
    };
  };

  // Recommended Walks Feature

  type Location = {
    latitude : Float;
    longitude : Float;
  };

  type RecommendedWalk = {
    id : Nat;
    name : Text;
    description : Text;
    distance : Float;
    location : Location;
    isCompleted : Bool;
    isFavourite : Bool;
  };

  let recommendedWalks = List.empty<RecommendedWalk>();
  let nextWalkId = Map.empty<Text, Nat>();
  let userWalkHistory = Map.empty<Text, List.List<Nat>>();

  func getNextWalkId(profileId : Text) : Nat {
    switch (nextWalkId.get(profileId)) {
      case (?id) {
        nextWalkId.add(profileId, id + 1);
        id;
      };
      case (null) {
        nextWalkId.add(profileId, 1);
        0;
      };
    };
  };

  public shared ({ caller }) func addRecommendedWalk(_profileId : Text, name : Text, description : Text, distance : Float, location : Location) : async () {
    let newWalk = {
      id = getNextWalkId("generic");
      name;
      description;
      distance;
      location;
      isCompleted = false;
      isFavourite = false;
    };
    recommendedWalks.add(newWalk);
  };

  public query ({ caller }) func getRecommendedWalks(_profileId : Text) : async [RecommendedWalk] {
    recommendedWalks.toArray();
  };

  public shared ({ caller }) func markWalkFavourite(_profileId : Text, walkId : Nat) : async () {
    let updatedList = recommendedWalks.toArray();
    let index = updatedList.findIndex(func(walk) { walk.id == walkId });

    switch (index) {
      case (?i) {
        if (i < updatedList.size()) {
          let updatedWalk = {
            updatedList[i] with
            isFavourite = true;
          };
          recommendedWalks.clear();
          for ((idx, walk) in updatedList.enumerate()) {
            if (idx == i) {
              recommendedWalks.add(updatedWalk);
            } else {
              recommendedWalks.add(walk);
            };
          };
        };
      };
      case (null) { Runtime.trap("Walk not found") };
    };
  };

  public shared ({ caller }) func markWalkCompleted(profileId : Text, walkId : Nat) : async () {
    let updatedList = recommendedWalks.toArray();
    let index = updatedList.findIndex(func(walk) { walk.id == walkId });

    switch (index) {
      case (?i) {
        if (i < updatedList.size()) {
          let updatedWalk = {
            updatedList[i] with
            isCompleted = true;
          };
          recommendedWalks.clear();
          for ((idx, walk) in updatedList.enumerate()) {
            if (idx == i) {
              recommendedWalks.add(updatedWalk);
            } else {
              recommendedWalks.add(walk);
            };
          };
          updateUserWalkHistory(profileId, walkId);
        };
      };
      case (null) { Runtime.trap("Walk not found") };
    };
  };

  func updateUserWalkHistory(profileId : Text, walkId : Nat) {
    let history = switch (userWalkHistory.get(profileId)) {
      case (null) {
        let newList = List.empty<Nat>();
        newList.add(walkId);
        newList;
      };
      case (?existing) {
        existing.add(walkId);
        existing;
      };
    };
    userWalkHistory.add(profileId, history);
  };

  public query ({ caller }) func getUserWalkHistory(profileId : Text) : async [Nat] {
    switch (userWalkHistory.get(profileId)) {
      case (null) { [] };
      case (?history) { history.toArray() };
    };
  };

  public query ({ caller }) func filterWalksByLocation(_profileId : Text, userLocation : Location, maxDistance : Float) : async [RecommendedWalk] {
    let filteredWalks = recommendedWalks.toArray().filter(
      func(walk) {
        let distance = calculateDistance(userLocation, walk.location);
        distance <= maxDistance;
      }
    );
    filteredWalks;
  };

  // Haversine formula for distance calculation
  func calculateDistance(loc1 : Location, loc2 : Location) : Float {
    let R: Float = 6371.0;
    let dLat = degreesToRadians(loc2.latitude - loc1.latitude);
    let dLng = degreesToRadians(loc2.longitude - loc1.longitude);

    let a = Float.pow(Float.pow((dLat / 2.0), 2.0), 2.0) +
            Float.cos(degreesToRadians(loc1.latitude)) * Float.cos(degreesToRadians(loc2.latitude)) *
            Float.pow(Float.sin(dLng / 2.0), 2.0);
    let c = 2.0 * Float.arctan2(Float.sqrt(a), Float.sqrt(1.0 - a));
    R * c;
  };

  func degreesToRadians(degrees : Float) : Float {
    degrees * 3.141592653589793 / 180.0;
  };
};
