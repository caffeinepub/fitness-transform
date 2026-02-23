import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Nat "mo:core/Nat";

module {
  // Walk session type from original
  type WalkSession = {
    steps : Nat;
    caloriesBurned : Nat;
    distanceInMeters : Float;
    durationInSeconds : Nat;
  };

  // Theme type from original
  type Theme = {
    name : Text;
    primaryColor : Text;
    secondaryColor : Text;
    accentColor : Text;
  };

  type OldActor = {
    walkData : Map.Map<Principal, List.List<WalkSession>>;
    userThemes : Map.Map<Principal, Theme>;
  };

  // New types
  type Customization = {
    fontSize : Nat;
    backgroundMusic : Text;
  };

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

  type Exercise = {
    name : Text;
    description : Text;
    category : Text;
  };

  // New actor type
  type NewActor = {
    walkData : Map.Map<Principal, List.List<WalkSession>>;
    userThemes : Map.Map<Principal, Theme>;
    // Additional persistent maps and lists
    taskData : Map.Map<Principal, List.List<DailyRecord>>;
    categoryMap : Map.Map<Text, List.List<Exercise>>;
    customizations : Map.Map<Principal, Customization>;
    nextTaskId : Map.Map<Principal, Nat>;
  };

  // Migration function: Main function called by the actor system on canister upgrade.
  public func run(old : OldActor) : NewActor {
    {
      walkData = old.walkData;
      userThemes = old.userThemes;
      taskData = Map.empty<Principal, List.List<DailyRecord>>();
      categoryMap = Map.empty<Text, List.List<Exercise>>();
      customizations = Map.empty<Principal, Customization>();
      nextTaskId = Map.empty<Principal, Nat>();
    };
  };
};
