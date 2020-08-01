

"use strict";

var RainOnMe = `variables
{
    global:
        0: _extendedGlobalCollection
        1: _arrayBuilder
        2: AllPos
        3: AllDir
        4: firstpos
        5: secondpos
        6: firstpoint2
        7: secondpoint2
        8: second
        9: z
        10: Wall_ID
        11: showwalls
        12: destoryall
        13: _arrayBuilder_0
        14: x
    player:
        0: _extendedPlayerCollection
        1: filterpos
        2: lastsavedpos
        3: closestbodypos
        4: fullbodypos
        5: prevpos_intersection
        6: active_wall
        7: closestwall
        8: x
        9: intersection_length
        10: intersection_length_0
}

// Extended collection variables:
// global [0]: _arrayBuilderStore

// Class identifiers:

rule("Initial Global")
{

    event
    {
        Ongoing - Global;
    }

    // Action count: 9
    actions
    {
        Set Global Variable(AllPos, Empty Array);
        Set Global Variable(AllDir, Empty Array);
        Set Global Variable(firstpos, Empty Array);
        Set Global Variable(secondpos, Empty Array);
        Set Global Variable(firstpoint2, Empty Array);
        Set Global Variable(secondpoint2, Empty Array);
        Set Global Variable(second, Empty Array);
        Set Global Variable(z, Empty Array);
        Set Global Variable(Wall_ID, Empty Array);
    }
}

rule("Initial Player")
{

    event
    {
        Ongoing - Each Player;
        All;
        All;
    }

    // Action count: 7
    actions
    {
        Set Player Variable(Event Player, filterpos, 0);
        Set Player Variable(Event Player, lastsavedpos, 0);
        Set Player Variable(Event Player, closestbodypos, 0);
        Set Player Variable(Event Player, fullbodypos, 0);
        Set Player Variable(Event Player, prevpos_intersection, 0);
        Set Player Variable(Event Player, active_wall, Empty Array);
        Set Player Variable(Event Player, closestwall, Empty Array);
    }
}

rule("Reset")
{

    event
    {
        Ongoing - Each Player;
        All;
        All;
    }

    conditions
    {
        Has Spawned(Event Player) == True;
    }

    // Action count: 51
    actions
    {
        Set Player Variable At Index(Event Player, lastsavedpos, Global Variable(z), Player Variable(Event Player, fullbodypos));
        Wait(0.016, Ignore Condition);
        Set Player Variable(Event Player, closestwall, Filtered Array(Global Variable(AllPos), Or(Compare(Distance Between(Add(Event Player, Multiply(Value In Array(Global Variable(AllDir), Current Array Index), Divide(Dot Product(Subtract(Current Array Element, Event Player), Value In Array(Global Variable(AllDir), Current Array Index)), Dot Product(Value In Array(Global Variable(AllDir), Current Array Index), Value In Array(Global Variable(AllDir), Current Array Index))))), Event Player), <, 2), Compare(Compare(Dot Product(Direction Towards(Current Array Element, Value In Array(Player Variable(Event Player, lastsavedpos), Current Array Index)), Value In Array(Global Variable(AllDir), Current Array Index)), >, 0), !=, Compare(Dot Product(Direction Towards(Current Array Element, Event Player), Value In Array(Global Variable(AllDir), Current Array Index)), >, 0)))));
        For Player Variable(Event Player, x, 0, Count Of(Player Variable(Event Player, closestwall)), 1);
        	Set Global Variable(z, Index Of Array Value(Global Variable(AllPos), Value In Array(Player Variable(Event Player, closestwall), Player Variable(Event Player, x))));
        	If(And(Compare(Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), >=, Y Component Of(Position of(Event Player))), Compare(Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), <=, Y Component Of(Add(Eye Position(Event Player), Vector(Empty Array, 0.2, Empty Array))))));
        		Set Player Variable(Event Player, closestbodypos, Value In Array(Global Variable(firstpos), Global Variable(z)));
        	Else If(And(Compare(Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), >=, Y Component Of(Position of(Event Player))), Compare(Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), <=, Y Component Of(Add(Eye Position(Event Player), Vector(Empty Array, 0.2, Empty Array))))));
        		Set Player Variable(Event Player, closestbodypos, Value In Array(Global Variable(secondpos), Global Variable(z)));
        	Else;
        		Set Player Variable(Event Player, closestbodypos, Position of(Event Player));
        	End;
        	Set Player Variable(Event Player, fullbodypos, Vector(X Component Of(Eye Position(Event Player)), Y Component Of(Player Variable(Event Player, closestbodypos)), Z Component Of(Eye Position(Event Player))));
        	Set Player Variable(Event Player, filterpos, Add(Player Variable(Event Player, fullbodypos), Multiply(Value In Array(Global Variable(AllDir), Global Variable(z)), Divide(Dot Product(Subtract(Value In Array(Global Variable(AllPos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Value In Array(Global Variable(AllDir), Global Variable(z))), Dot Product(Value In Array(Global Variable(AllDir), Global Variable(z)), Value In Array(Global Variable(AllDir), Global Variable(z)))))));
        	If(Or(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 0), Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 2)));
        		Set Player Variable(Event Player, intersection_length, Divide(Dot Product(Subtract(Value In Array(Global Variable(AllPos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Value In Array(Global Variable(AllDir), Global Variable(z))), Dot Product(Direction Towards(Value In Array(Player Variable(Event Player, lastsavedpos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Value In Array(Global Variable(AllDir), Global Variable(z)))));
        		Set Player Variable(Event Player, prevpos_intersection, Add(Player Variable(Event Player, fullbodypos), Multiply(Multiply(Direction Towards(Value In Array(Player Variable(Event Player, lastsavedpos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Vector(1, Empty Array, 1)), Player Variable(Event Player, intersection_length))));
        		If(Compare(Compare(Dot Product(Direction Towards(Value In Array(Global Variable(AllPos), Global Variable(z)), Value In Array(Player Variable(Event Player, lastsavedpos), Global Variable(z))), Value In Array(Global Variable(AllDir), Global Variable(z))), >, 0), !=, Compare(Dot Product(Direction Towards(Value In Array(Global Variable(AllPos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Value In Array(Global Variable(AllDir), Global Variable(z))), >, 0)));
        			If(And(And(And(Compare(Dot Product(Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Player Variable(Event Player, prevpos_intersection))), >=, 0), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Player Variable(Event Player, prevpos_intersection))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Player Variable(Event Player, prevpos_intersection))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Player Variable(Event Player, prevpos_intersection))), >=, 0)));
        				Cancel Primary Action(Event Player);
        				Teleport(Event Player, Add(Player Variable(Event Player, prevpos_intersection), Multiply(Direction Towards(Player Variable(Event Player, prevpos_intersection), Value In Array(Player Variable(Event Player, lastsavedpos), Global Variable(z))), 1.001)));
        			End;
        		End;
        	End;
        	If(And(And(And(And(Compare(Distance Between(Player Variable(Event Player, fullbodypos), Player Variable(Event Player, filterpos)), <=, 1), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Player Variable(Event Player, filterpos))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Player Variable(Event Player, filterpos))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Player Variable(Event Player, filterpos))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Player Variable(Event Player, filterpos))), >=, 0)));
        		If(Compare(Count Of(Filtered Array(Player Variable(Event Player, active_wall), Compare(Current Array Element, ==, 1))), ==, 0));
        			Set Player Variable At Index(Event Player, active_wall, Global Variable(z), 1);
        			If(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 5));
        				Disable Movement Collision With Environment(Event Player, False);
        			End;
        		End;
        		If(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 0));
        			If(Compare(Distance Between(Player Variable(Event Player, fullbodypos), Player Variable(Event Player, filterpos)), <=, 0.8));
        				Set Player Variable(Event Player, intersection_length_0, Divide(Dot Product(Subtract(Value In Array(Global Variable(AllPos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Value In Array(Global Variable(AllDir), Global Variable(z))), Dot Product(Normalize(World Vector Of(Throttle Of(Event Player), Event Player, Rotation)), Value In Array(Global Variable(AllDir), Global Variable(z)))));
        				Set Player Variable(Event Player, prevpos_intersection, Add(Player Variable(Event Player, fullbodypos), Multiply(Multiply(Normalize(World Vector Of(Throttle Of(Event Player), Event Player, Rotation)), Vector(1, Empty Array, 1)), Player Variable(Event Player, intersection_length_0))));
        				Apply Impulse(Event Player, Multiply(Direction Towards(Player Variable(Event Player, prevpos_intersection), Value In Array(Player Variable(Event Player, lastsavedpos), Global Variable(z))), Vector(1, Empty Array, 1)), 0.001, To World, Cancel Contrary Motion);
        			End;
        			Apply Impulse(Event Player, Multiply(Direction Towards(Player Variable(Event Player, filterpos), Player Variable(Event Player, fullbodypos)), Vector(1, Empty Array, 1)), 0.001, To World, Cancel Contrary Motion);
        			Start Throttle In Direction(Event Player, Null, False, To World, Add To Existing Throttle, None);
        		Else If(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 2));
        			Apply Impulse(Event Player, Direction Towards(Player Variable(Event Player, filterpos), Player Variable(Event Player, fullbodypos)), 10, To World, Cancel Contrary Motion);
        		End;
        	Else;
        		Set Player Variable At Index(Event Player, active_wall, Global Variable(z), 0);
        	End;
        End;
        Set Player Variable(Event Player, fullbodypos, Vector(X Component Of(Eye Position(Event Player)), Y Component Of(Player Variable(Event Player, closestbodypos)), Z Component Of(Eye Position(Event Player))));
        For Global Variable(z, 0, Count Of(Global Variable(AllPos)), 1);
        	Set Player Variable At Index(Event Player, lastsavedpos, Global Variable(z), Player Variable(Event Player, fullbodypos));
        End;
        Loop;
    }
}

rule("Reset")
{

    event
    {
        Ongoing - Each Player;
        All;
        All;
    }

    conditions
    {
        Count Of(Filtered Array(Player Variable(Event Player, active_wall), Compare(Current Array Element, !=, 0))) == 0;
    }

    // Action count: 2
    actions
    {
        Stop Forcing Throttle(Event Player);
        Enable Movement Collision With Environment(Event Player);
    }
}

rule("Throttle Loop")
{

    event
    {
        Ongoing - Each Player;
        All;
        All;
    }

    conditions
    {
        Is True For Any(Player Variable(Event Player, active_wall), Current Array Element) == True;
    }

    // Action count: 3
    actions
    {
        Start Throttle In Direction(Event Player, Null, False, To World, Add To Existing Throttle, None);
        Wait(0.016, Ignore Condition);
        Loop If Condition Is True;
    }
}

rule("Effect Creation")
{

    event
    {
        Ongoing - Global;
    }

    // Action count: 18
    actions
    {
        Wait(5, Ignore Condition);
        If(Global Variable(showwalls));
        	For Global Variable(x, 0, Count Of(Global Variable(AllPos)), 1);
        		If(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(x)), ==, 5));
        			Create Beam Effect(All Players(Team(All)), Good Beam, Value In Array(Global Variable(firstpos), Global Variable(x)), Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(x)))), Aqua, None);
        			Create Beam Effect(All Players(Team(All)), Good Beam, Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(x)))), Add(Value In Array(Global Variable(secondpos), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Aqua, None);
        			Create Beam Effect(All Players(Team(All)), Good Beam, Add(Value In Array(Global Variable(firstpos), Global Variable(x)), Vector(0.001, Empty Array, Empty Array)), Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(x)))), Aqua, None);
        			Create Beam Effect(All Players(Team(All)), Good Beam, Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(x)))), Add(Value In Array(Global Variable(secondpos), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Aqua, None);
        		Else;
        			Create Effect(All Players(Team(All)), Sphere, Yellow, Divide(Add(Value In Array(Global Variable(firstpos), Global Variable(x)), Value In Array(Global Variable(secondpos), Global Variable(x))), 2), 0.1, None);
        			Create Beam Effect(All Players(Team(All)), Grapple Beam, Value In Array(Global Variable(firstpos), Global Variable(x)), Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(x)))), Aqua, None);
        			Create Beam Effect(All Players(Team(All)), Grapple Beam, Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(x)))), Add(Value In Array(Global Variable(secondpos), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Aqua, None);
        			Create Beam Effect(All Players(Team(All)), Grapple Beam, Add(Value In Array(Global Variable(firstpos), Global Variable(x)), Vector(0.001, Empty Array, Empty Array)), Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(x)))), Aqua, None);
        			Create Beam Effect(All Players(Team(All)), Grapple Beam, Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(x)))), Add(Value In Array(Global Variable(secondpos), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Aqua, None);
        		End;
        		Wait(0.016, Ignore Condition);
        	End;
        End;
    }
}`
