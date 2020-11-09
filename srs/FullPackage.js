
"use strict";

var RainOnMe = `variables
{
	global:
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
		14: beam_ID
		15: g_beamType
		16: initialized
		17: x

	player:
		1: filterpos
		2: lastsavedpos
		3: closestbodypos
		4: fullbodypos
		5: prevpos_intersection
		6: active_wall
		7: closestwall
		8: is_Grounded
		9: x
		10: intersection_length
		11: thickness
		12: intersection_length_0
		13: thickness_0
		14: intersection_length_1
		15: intersection_length_2
}

rule("Initial Global")
{
	event
	{
		Ongoing - Global;
	}

	actions
	{
		Global.AllPos = Empty Array;
		Global.AllDir = Empty Array;
		Global.firstpos = Empty Array;
		Global.secondpos = Empty Array;
		Global.firstpoint2 = Empty Array;
		Global.secondpoint2 = Empty Array;
		Global.second = Empty Array;
		Global.z = Empty Array;
		Global.Wall_ID = Empty Array;
		Global.beam_ID = Empty Array;
		Global.g_beamType = Empty Array;
		Global.initialized = False;
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

	actions
	{
		Event Player.filterpos = 0;
		Event Player.lastsavedpos = 0;
		Event Player.closestbodypos = 0;
		Event Player.fullbodypos = Position Of(Event Player);
		Event Player.prevpos_intersection = Position Of(Event Player);
		Event Player.active_wall = Empty Array;
	}
}

rule("Collision Logic")
{
	event
	{
		Ongoing - Each Player;
		All;
		All;
	}

	conditions
	{
		Global.initialized == True;
	}

	actions
	{
		Event Player.lastsavedpos = (Eye Position(Event Player) + Position Of(Event Player)) / 2;
		Wait(0.016, Ignore Condition);
		Event Player.closestwall = Filtered Array(Global.AllPos, Event Player.active_wall[Current Array Index] == 1 || Distance Between(
			Event Player + Global.AllDir[Current Array Index] * Dot Product(Current Array Element - Event Player,
			Global.AllDir[Current Array Index]) / Dot Product(Global.AllDir[Current Array Index], Global.AllDir[Current Array Index]),
			Event Player) < 2 || (Dot Product(Direction Towards(Current Array Element, Event Player.lastsavedpos),
			Global.AllDir[Current Array Index]) > 0) != (Dot Product(Direction Towards(Current Array Element, Event Player),
			Global.AllDir[Current Array Index]) > 0)
			|| Global.Wall_ID[Current Array Index] == 6 || Global.Wall_ID[Current Array Index] == 9);
		For Player Variable(Event Player, x, 0, Count Of(Event Player.closestwall), 1);
			Global.z = Index Of Array Value(Global.AllPos, Event Player.closestwall[Event Player.x]);
			If(Global.Wall_ID[Global.z] == 1 || Global.Wall_ID[Global.z] == 3 || Global.Wall_ID[Global.z] == 5);
				If(Y Component Of(Global.firstpos[Global.z]) >= Y Component Of(Position Of(Event Player)) && Y Component Of(
					Global.firstpos[Global.z]) <= Y Component Of(Eye Position(Event Player) + Vector(Empty Array, 0.200, Empty Array)));
					Event Player.closestbodypos = Global.firstpos[Global.z];
				Else If(Y Component Of(Global.secondpos[Global.z]) >= Y Component Of(Position Of(Event Player)) && Y Component Of(
						Global.secondpos[Global.z]) <= Y Component Of(Eye Position(Event Player) + Vector(Empty Array, 0.200, Empty Array)));
					Event Player.closestbodypos = Global.secondpos[Global.z];
				Else;
					Event Player.closestbodypos = Position Of(Event Player);
				End;
				Event Player.fullbodypos = Vector(X Component Of(Eye Position(Event Player)), Y Component Of(Event Player.closestbodypos),
					Z Component Of(Eye Position(Event Player)));
				Event Player.filterpos = Event Player.fullbodypos + Global.AllDir[Global.z] * Dot Product(
					Global.AllPos[Global.z] - Event Player.fullbodypos, Global.AllDir[Global.z]) / Dot Product(Global.AllDir[Global.z],
					Global.AllDir[Global.z]);
				If(Global.Wall_ID[Global.z] == 1 || Global.Wall_ID[Global.z] == 3);
					If((Dot Product(Direction Towards(Global.AllPos[Global.z], Event Player.lastsavedpos), Global.AllDir[Global.z]) > 0) != (
						Dot Product(Direction Towards(Global.AllPos[Global.z], Event Player.fullbodypos), Global.AllDir[Global.z]) > 0));
						Event Player.intersection_length = Dot Product(Global.AllPos[Global.z] - Event Player.fullbodypos, Global.AllDir[Global.z])
							/ Dot Product(Direction Towards(Event Player.lastsavedpos, Event Player.fullbodypos), Global.AllDir[Global.z]);
						Event Player.prevpos_intersection = Event Player.fullbodypos + Direction Towards(Event Player.lastsavedpos,
							Event Player.fullbodypos) * Vector(1, Empty Array, 1) * Event Player.intersection_length;
						If(Dot Product(Direction Towards(Global.firstpos[Global.z], Vector(X Component Of(Global.secondpos[Global.z]), Y Component Of(
							Global.firstpos[Global.z]), Z Component Of(Global.secondpos[Global.z]))), Direction Towards(Global.firstpos[Global.z],
							Event Player.prevpos_intersection)) >= 0 && Dot Product(Direction Towards(Global.firstpos[Global.z], Vector(X Component Of(
							Global.firstpos[Global.z]), Y Component Of(Global.secondpos[Global.z]), Z Component Of(Global.firstpos[Global.z]))),
							Direction Towards(Global.firstpos[Global.z], Event Player.prevpos_intersection)) >= 0 && Dot Product(Direction Towards(
							Global.secondpos[Global.z], Vector(X Component Of(Global.secondpos[Global.z]), Y Component Of(Global.firstpos[Global.z]),
							Z Component Of(Global.secondpos[Global.z]))), Direction Towards(Global.secondpos[Global.z], Event Player.prevpos_intersection))
							>= 0 && Dot Product(Direction Towards(Global.secondpos[Global.z], Vector(X Component Of(Global.firstpos[Global.z]),
							Y Component Of(Global.secondpos[Global.z]), Z Component Of(Global.firstpos[Global.z]))), Direction Towards(
							Global.secondpos[Global.z], Event Player.prevpos_intersection)) >= 0);
							Cancel Primary Action(Event Player);
							Teleport(Event Player, Event Player.prevpos_intersection + Direction Towards(Event Player.prevpos_intersection,
								Event Player.lastsavedpos) * Vector(1, Empty Array, 1) * 2);
						End;
					End;
				End;
				Event Player.thickness = 0;
				If(Global.Wall_ID[Global.z] == 5);
					Event Player.thickness = 4;
				Else;
					Event Player.thickness = 1;
				End;
				If(Distance Between(Event Player.fullbodypos, Event Player.filterpos) <= Event Player.thickness && Dot Product(Direction Towards(
					Global.firstpos[Global.z], Vector(X Component Of(Global.secondpos[Global.z]), Y Component Of(Global.firstpos[Global.z]),
					Z Component Of(Global.secondpos[Global.z]))), Direction Towards(Global.firstpos[Global.z], Event Player.filterpos))
					>= 0 && Dot Product(Direction Towards(Global.firstpos[Global.z], Vector(X Component Of(Global.firstpos[Global.z]),
					Y Component Of(Global.secondpos[Global.z]), Z Component Of(Global.firstpos[Global.z]))), Direction Towards(
					Global.firstpos[Global.z], Event Player.filterpos)) >= 0 && Dot Product(Direction Towards(Global.secondpos[Global.z], Vector(
					X Component Of(Global.secondpos[Global.z]), Y Component Of(Global.firstpos[Global.z]), Z Component Of(
					Global.secondpos[Global.z]))), Direction Towards(Global.secondpos[Global.z], Event Player.filterpos)) >= 0 && Dot Product(
					Direction Towards(Global.secondpos[Global.z], Vector(X Component Of(Global.firstpos[Global.z]), Y Component Of(
					Global.secondpos[Global.z]), Z Component Of(Global.firstpos[Global.z]))), Direction Towards(Global.secondpos[Global.z],
					Event Player.filterpos)) >= 0);
					If(Event Player.active_wall[Global.z] == False);
						Event Player.active_wall[Global.z] = 1;
						If((Global.Wall_ID[Global.z] == 1 || Global.Wall_ID[Global.z] == 3) && Event Player.is_Grounded == False);
							Set Gravity(Event Player, 100);
						Else If(Global.Wall_ID[Global.z] == 5);
							Disable Movement Collision With Environment(Event Player, False);
						End;
					End;
					If(Global.Wall_ID[Global.z] == 1);
						Apply Impulse(Event Player, Direction Towards(Event Player.filterpos, Event Player.fullbodypos) * Vector(1, Empty Array, 1), 0.001,
							To World, Cancel Contrary Motion);
						Set Move Speed(Event Player, 100 - Dot Product(Direction Towards(Eye Position(Event Player), Eye Position(Event Player)
							+ World Vector Of(Throttle Of(Event Player), Event Player, Rotation)), Direction Towards(Event Player.filterpos,
							Event Player.fullbodypos) * -1) * 100);
					Else If(Global.Wall_ID[Global.z] == 3);
						Apply Impulse(Event Player, Direction Towards(Event Player.filterpos, Event Player.fullbodypos), Speed Of(Event Player), To World,
							Cancel Contrary Motion);
					End;
				Else;
					Event Player.active_wall[Global.z] = 0;
					Set Move Speed(Event Player, 100);
				End;
			Else If(Global.Wall_ID[Global.z] == 2 || Global.Wall_ID[Global.z] == 6 || Global.Wall_ID[Global.z] == 7);
				If(Y Component Of(Global.firstpos[Global.z]) >= Y Component Of(Position Of(Event Player)) && Y Component Of(
					Global.firstpos[Global.z]) <= Y Component Of(Eye Position(Event Player) + Vector(Empty Array, 0.200, Empty Array)));
					Event Player.closestbodypos = Global.firstpos[Global.z];
				Else If(Y Component Of(Global.firstpos[Global.z]) <= Y Component Of(Position Of(Event Player)));
					Event Player.closestbodypos = Position Of(Event Player);
				Else If(Y Component Of(Global.firstpos[Global.z]) >= Y Component Of(Eye Position(Event Player)));
					Event Player.closestbodypos = Eye Position(Event Player);
				End;
				Event Player.fullbodypos = Vector(X Component Of(Eye Position(Event Player)), Y Component Of(Event Player.closestbodypos),
					Z Component Of(Eye Position(Event Player)));
				Event Player.filterpos = Event Player.fullbodypos + Global.AllDir[Global.z] * Dot Product(
					Global.AllPos[Global.z] - Event Player.fullbodypos, Global.AllDir[Global.z]) / Dot Product(Global.AllDir[Global.z],
					Global.AllDir[Global.z]);
				If(Global.Wall_ID[Global.z] == 2 || Global.Wall_ID[Global.z] == 7);
					If((Dot Product(Direction Towards(Global.AllPos[Global.z], Event Player.lastsavedpos), Global.AllDir[Global.z]) > 0) != (
						Dot Product(Direction Towards(Global.AllPos[Global.z], Event Player.fullbodypos), Global.AllDir[Global.z]) > 0));
						Event Player.intersection_length_0 = Dot Product(Global.AllPos[Global.z] - Event Player.fullbodypos, Global.AllDir[Global.z])
							/ Dot Product(Direction Towards(Event Player.lastsavedpos, Event Player.fullbodypos), Global.AllDir[Global.z]);
						Event Player.prevpos_intersection = Event Player.fullbodypos + Direction Towards(Event Player.lastsavedpos,
							Event Player.fullbodypos) * Up * Event Player.intersection_length_0;
						If(Dot Product(Down, Direction Towards(Event Player.lastsavedpos, Event Player.prevpos_intersection)) > 0);
							If(Dot Product(Direction Towards(Global.firstpos[Global.z], Global.secondpoint2[Global.z]), Direction Towards(
								Global.firstpos[Global.z], Event Player.prevpos_intersection)) >= 0 && Dot Product(Direction Towards(Global.firstpos[Global.z],
								Global.firstpoint2[Global.z]), Direction Towards(Global.firstpos[Global.z], Event Player.prevpos_intersection))
								>= 0 && Dot Product(Direction Towards(Global.secondpos[Global.z], Global.secondpoint2[Global.z]), Direction Towards(
								Global.secondpos[Global.z], Event Player.prevpos_intersection)) >= 0 && Dot Product(Direction Towards(
								Global.secondpos[Global.z], Global.firstpoint2[Global.z]), Direction Towards(Global.secondpos[Global.z],
								Event Player.prevpos_intersection)) >= 0);
								Cancel Primary Action(Event Player);
								If(Hero Of(Event Player) == Hero(Wrecking Ball));
									Teleport(Event Player, Nearest Walkable Position(Event Player.prevpos_intersection));
									Wait(0.016, Ignore Condition);
									Teleport(Event Player, Event Player.prevpos_intersection + Up);
								Else;
									Teleport(Event Player, Event Player.prevpos_intersection + Up);
								End;
							End;
						End;
					End;
				End;
				Event Player.thickness_0 = 0;
				If(Global.Wall_ID[Global.z] == 6);
					Event Player.thickness_0 = 6;
				Else;
					Event Player.thickness_0 = 0.500;
				End;
				If(Distance Between(Event Player.filterpos, Event Player.fullbodypos) <= Event Player.thickness_0 && Dot Product(Direction Towards(
					Global.firstpos[Global.z], Global.secondpoint2[Global.z]), Direction Towards(Global.firstpos[Global.z],
					Event Player.filterpos)) >= 0 && Dot Product(Direction Towards(Global.firstpos[Global.z], Global.firstpoint2[Global.z]),
					Direction Towards(Global.firstpos[Global.z], Event Player.filterpos)) >= 0 && Dot Product(Direction Towards(
					Global.secondpos[Global.z], Global.secondpoint2[Global.z]), Direction Towards(Global.secondpos[Global.z],
					Event Player.filterpos)) >= 0 && Dot Product(Direction Towards(Global.secondpos[Global.z], Global.firstpoint2[Global.z]),
					Direction Towards(Global.secondpos[Global.z], Event Player.filterpos)) >= 0);
					If(Global.Wall_ID[Global.z] == 2);
						If(Dot Product(Down, Direction Towards(Event Player.fullbodypos, Event Player.filterpos)) > 0);
							If(Event Player.active_wall[Global.z] == False);
								Event Player.is_Grounded = True;
								Set Gravity(Event Player, 0);
								Event Player.active_wall[Global.z] = 1;
								Apply Impulse(Event Player, Up, 0.001, To World, Cancel Contrary Motion);
								Apply Impulse(Event Player, Down, 0.001, To World, Cancel Contrary Motion);
								If(Horizontal Speed Of(Event Player) > 0.010);
									Apply Impulse(Event Player, Left, 0.001, To World, Cancel Contrary Motion);
									Apply Impulse(Event Player, Right, 0.001, To World, Cancel Contrary Motion);
									Apply Impulse(Event Player, Forward, 0.001, To World, Cancel Contrary Motion);
									Apply Impulse(Event Player, Backward, 0.001, To World, Cancel Contrary Motion);
								End;
							End;
							If(Is Button Held(Event Player, Button(Jump)));
								Apply Impulse(Event Player, Up, 5.500, To World, Cancel Contrary Motion);
							End;
							If(Throttle Of(Event Player) != Vector(Empty Array, Empty Array, Empty Array));
								Apply Impulse(Event Player, Cross Product(Up, Normalize(World Vector Of(Throttle Of(Event Player), Event Player, Rotation))),
									0.001, To World, Cancel Contrary Motion);
								Apply Impulse(Event Player, Cross Product(Down, Normalize(World Vector Of(Throttle Of(Event Player), Event Player, Rotation))),
									0.001, To World, Cancel Contrary Motion);
								Apply Impulse(Event Player, Direction Towards(Eye Position(Event Player), Eye Position(Event Player) + Normalize(World Vector Of(
									Throttle Of(Event Player), Event Player, Rotation))), 3, To World, Cancel Contrary Motion);
							End;
							If(Throttle Of(Event Player) == Vector(Empty Array, Empty Array, Empty Array) && Horizontal Speed Of(Event Player) > 0.010);
								Apply Impulse(Event Player, Left, 0.001, To World, Cancel Contrary Motion);
								Apply Impulse(Event Player, Right, 0.001, To World, Cancel Contrary Motion);
								Apply Impulse(Event Player, Forward, 0.001, To World, Cancel Contrary Motion);
								Apply Impulse(Event Player, Backward, 0.001, To World, Cancel Contrary Motion);
							End;
						Else;
							Apply Impulse(Event Player, Down, 0.001, To World, Cancel Contrary Motion);
						End;
					Else If(Global.Wall_ID[Global.z] == 6);
						If(Event Player.active_wall[Global.z] == False);
							Event Player.active_wall[Global.z] = 1;
							Disable Movement Collision With Environment(Event Player, True);
						End;
					Else If(Global.Wall_ID[Global.z] == 7);
						If(Dot Product(Down, Direction Towards(Event Player.fullbodypos, Event Player.filterpos)) >= 0);
							If(Is Button Held(Event Player, Button(Jump)));
								Apply Impulse(Event Player, Up, 5.500, To World, Cancel Contrary Motion);
							End;
							If(Event Player.active_wall[Global.z] == False);
								Event Player.active_wall[Global.z] = 1;
								Set Gravity(Event Player, 0);
							End;
							Apply Impulse(Event Player, Up, 0.001, To World, Cancel Contrary Motion);
						Else;
							Apply Impulse(Event Player, Down, 0.001, To World, Cancel Contrary Motion);
						End;
					End;
				Else;
					Event Player.active_wall[Global.z] = 0;
					Event Player.is_Grounded = False;
				End;
			Else If(Global.Wall_ID[Global.z] == 4);
				Event Player.closestbodypos = Position Of(Event Player) + Vector(Empty Array, 0.500, Empty Array);
				Event Player.fullbodypos = Vector(X Component Of(Eye Position(Event Player)), Y Component Of(Event Player.closestbodypos),
					Z Component Of(Eye Position(Event Player)));
				Event Player.filterpos = Event Player.fullbodypos + Global.AllDir[Global.z] * Dot Product(
					Global.AllPos[Global.z] - Event Player.fullbodypos, Global.AllDir[Global.z]) / Dot Product(Global.AllDir[Global.z],
					Global.AllDir[Global.z]);
				If((Dot Product(Direction Towards(Global.AllPos[Global.z], Event Player.lastsavedpos), Global.AllDir[Global.z]) > 0) != (
					Dot Product(Direction Towards(Global.AllPos[Global.z], Event Player.fullbodypos), Global.AllDir[Global.z]) > 0));
					Event Player.intersection_length_1 = Dot Product(Global.AllPos[Global.z] - Event Player.fullbodypos, Global.AllDir[Global.z])
						/ Dot Product(Direction Towards(Event Player.lastsavedpos, Event Player.fullbodypos), Global.AllDir[Global.z]);
					Event Player.prevpos_intersection = Ray Cast Hit Position(Event Player.fullbodypos, Event Player.fullbodypos + Direction Towards(
						Event Player.lastsavedpos, Event Player.fullbodypos) * Event Player.intersection_length_1, Null, Event Player, True);
					If(Dot Product(Direction Towards(Global.firstpos[Global.z], Global.secondpoint2[Global.z]), Direction Towards(
						Global.firstpos[Global.z], Event Player.prevpos_intersection)) >= 0 && Dot Product(Direction Towards(Global.firstpos[Global.z],
						Global.firstpoint2[Global.z]), Direction Towards(Global.firstpos[Global.z], Event Player.prevpos_intersection))
						>= 0 && Dot Product(Direction Towards(Global.secondpos[Global.z], Global.secondpoint2[Global.z]), Direction Towards(
						Global.secondpos[Global.z], Event Player.prevpos_intersection)) >= 0 && Dot Product(Direction Towards(
						Global.secondpos[Global.z], Global.firstpoint2[Global.z]), Direction Towards(Global.secondpos[Global.z],
						Event Player.prevpos_intersection)) >= 0);
						Teleport(Event Player, Ray Cast Hit Position(Event Player.prevpos_intersection,
							Event Player.prevpos_intersection + Direction Towards(Event Player.prevpos_intersection, Event Player.lastsavedpos) * Vector(1,
							Empty Array, 1), Null, Event Player, True));
						If(Hero Of(Event Player) == Hero(Doomfist) && Is Using Ability 2(Event Player));
							Teleport(Event Player, Nearest Walkable Position(Event Player.prevpos_intersection));
							Wait(0.016, Ignore Condition);
							Teleport(Event Player, Ray Cast Hit Position(Event Player.prevpos_intersection, Event Player.prevpos_intersection + Up, Null,
								Event Player, True));
							Cancel Primary Action(Event Player);
						Else If(Hero Of(Event Player) == Hero(Wrecking Ball));
							Cancel Primary Action(Event Player);
							Teleport(Event Player, Nearest Walkable Position(Event Player.prevpos_intersection));
							Wait(0.016, Ignore Condition);
							Teleport(Event Player, Ray Cast Hit Position(Event Player.prevpos_intersection, Event Player.prevpos_intersection + Up, Null,
								Event Player, True));
						End;
						Apply Impulse(Event Player, Global.AllDir[Global.z], 0.001, To World, Cancel Contrary Motion XYZ);
					End;
				End;
				If(Distance Between(Event Player.filterpos, Event Player.fullbodypos) <= 1 && Dot Product(Direction Towards(
					Global.firstpos[Global.z], Global.secondpoint2[Global.z]), Direction Towards(Global.firstpos[Global.z],
					Event Player.filterpos)) >= 0 && Dot Product(Direction Towards(Global.firstpos[Global.z], Global.firstpoint2[Global.z]),
					Direction Towards(Global.firstpos[Global.z], Event Player.filterpos)) >= 0 && Dot Product(Direction Towards(
					Global.secondpos[Global.z], Global.secondpoint2[Global.z]), Direction Towards(Global.secondpos[Global.z],
					Event Player.filterpos)) >= 0 && Dot Product(Direction Towards(Global.secondpos[Global.z], Global.firstpoint2[Global.z]),
					Direction Towards(Global.secondpos[Global.z], Event Player.filterpos)) >= 0);
					If(Dot Product(Up, Direction Towards(Event Player.filterpos, Event Player.closestbodypos)) > 0);
						Apply Impulse(Event Player, Global.AllDir[Global.z], 0.001, To World, Cancel Contrary Motion XYZ);
					Else;
						Apply Impulse(Event Player, Global.AllDir[Global.z], 0.001, To Player, Cancel Contrary Motion XYZ);
					End;
				Else;
					Event Player.active_wall[Global.z] = 0;
				End;
			Else If(Global.Wall_ID[Global.z] == 8);
				Event Player.closestbodypos = Position Of(Event Player) + Vector(Empty Array, 0.500, Empty Array);
				Event Player.fullbodypos = Vector(X Component Of(Eye Position(Event Player)), Y Component Of(Event Player.closestbodypos),
					Z Component Of(Eye Position(Event Player)));
				Event Player.filterpos = Event Player.fullbodypos + Global.AllDir[Global.z] * Dot Product(
					Global.AllPos[Global.z] - Event Player.fullbodypos, Global.AllDir[Global.z]) / Dot Product(Global.AllDir[Global.z],
					Global.AllDir[Global.z]);
				If((Dot Product(Direction Towards(Global.AllPos[Global.z], Event Player.lastsavedpos), Global.AllDir[Global.z]) > 0) != (
					Dot Product(Direction Towards(Global.AllPos[Global.z], Event Player.fullbodypos), Global.AllDir[Global.z]) > 0));
					Event Player.intersection_length_2 = Dot Product(Global.AllPos[Global.z] - Event Player.fullbodypos, Global.AllDir[Global.z])
						/ Dot Product(Direction Towards(Event Player.lastsavedpos, Event Player.fullbodypos), Global.AllDir[Global.z]);
					Event Player.prevpos_intersection = Ray Cast Hit Position(Event Player.fullbodypos, Event Player.fullbodypos + Direction Towards(
						Event Player.lastsavedpos, Event Player.fullbodypos) * Event Player.intersection_length_2, Null, Event Player, True);
					If(Dot Product(Direction Towards(Global.firstpos[Global.z], Global.secondpoint2[Global.z]), Direction Towards(
						Global.firstpos[Global.z], Event Player.prevpos_intersection)) >= 0 && Dot Product(Direction Towards(Global.firstpos[Global.z],
						Global.firstpoint2[Global.z]), Direction Towards(Global.firstpos[Global.z], Event Player.prevpos_intersection))
						>= 0 && Dot Product(Direction Towards(Global.secondpos[Global.z], Global.secondpoint2[Global.z]), Direction Towards(
						Global.secondpos[Global.z], Event Player.prevpos_intersection)) >= 0 && Dot Product(Direction Towards(
						Global.secondpos[Global.z], Global.firstpoint2[Global.z]), Direction Towards(Global.secondpos[Global.z],
						Event Player.prevpos_intersection)) >= 0);
						Teleport(Event Player, Ray Cast Hit Position(Event Player.prevpos_intersection,
							Event Player.prevpos_intersection + Direction Towards(Event Player.prevpos_intersection, Event Player.lastsavedpos) * Vector(1,
							Empty Array, 1), Null, Event Player, True));
						If(Hero Of(Event Player) == Hero(Doomfist) && Is Using Ability 2(Event Player));
							Teleport(Event Player, Nearest Walkable Position(Event Player.prevpos_intersection));
							Wait(0.016, Ignore Condition);
							Teleport(Event Player, Ray Cast Hit Position(Event Player.prevpos_intersection, Event Player.prevpos_intersection + Up, Null,
								Event Player, True));
							Cancel Primary Action(Event Player);
						Else If(Hero Of(Event Player) == Hero(Wrecking Ball));
							Cancel Primary Action(Event Player);
							Teleport(Event Player, Nearest Walkable Position(Event Player.prevpos_intersection));
							Wait(0.016, Ignore Condition);
							Teleport(Event Player, Ray Cast Hit Position(Event Player.prevpos_intersection, Event Player.prevpos_intersection + Up, Null,
								Event Player, True));
						End;
						Apply Impulse(Event Player, Global.AllDir[Global.z], 0.001, To World, Cancel Contrary Motion);
					End;
				End;
				If(Distance Between(Event Player.filterpos, Event Player.fullbodypos) <= 1 && Dot Product(Direction Towards(
					Global.firstpos[Global.z], Global.secondpoint2[Global.z]), Direction Towards(Global.firstpos[Global.z],
					Event Player.filterpos)) >= 0 && Dot Product(Direction Towards(Global.firstpos[Global.z], Global.firstpoint2[Global.z]),
					Direction Towards(Global.firstpos[Global.z], Event Player.filterpos)) >= 0 && Dot Product(Direction Towards(
					Global.secondpos[Global.z], Global.secondpoint2[Global.z]), Direction Towards(Global.secondpos[Global.z],
					Event Player.filterpos)) >= 0 && Dot Product(Direction Towards(Global.secondpos[Global.z], Global.firstpoint2[Global.z]),
					Direction Towards(Global.secondpos[Global.z], Event Player.filterpos)) >= 0);
					If(Dot Product(Up, Direction Towards(Event Player.filterpos, Event Player.closestbodypos)) > 0);
						Apply Impulse(Event Player, Global.AllDir[Global.z], 0.001, To World, Cancel Contrary Motion XYZ);
					Else;
						Apply Impulse(Event Player, Direction Towards(Event Player.filterpos, Event Player.fullbodypos), 0.001, To World,
							Cancel Contrary Motion);
					End;
				Else;
					Event Player.active_wall[Global.z] = 0;
				End;
			End;
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
		Count Of(Filtered Array(Event Player.active_wall, Current Array Element != 0)) == 0;
	}

	actions
	{
		Set Gravity(Event Player, 100);
		Stop Forcing Throttle(Event Player);
		Stop Accelerating(Event Player);
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
		Is True For Any(Event Player.active_wall, Current Array Element) == True;
	}

	actions
	{
		Start Throttle In Direction(Event Player, Null, False, To World, Add to existing throttle, None);
		Wait(0.016, Ignore Condition);
		Loop If Condition Is True;
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

	actions
	{
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

	actions
	{
		Wait(5, Ignore Condition);
		If(Global.showwalls);
			For Global Variable(x, 0, Count Of(Global.AllPos), 1);
				If(Global.Wall_ID[Global.x] == 1 || Global.Wall_ID[Global.x] == 3 || Global.Wall_ID[Global.x] == 5);
					If(Global.Wall_ID[Global.x] == 5);
						Create Beam Effect(All Players(All Teams), Good Beam, Global.firstpos[Global.x], Vector(X Component Of(Global.secondpos[Global.x]),
							Y Component Of(Global.firstpos[Global.x]), Z Component Of(Global.secondpos[Global.x])), Color(Red), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID)];
						Global._arrayBuilder[0] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID)] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Good Beam, Vector(X Component Of(Global.secondpos[Global.x]), Y Component Of(
							Global.firstpos[Global.x]), Z Component Of(Global.secondpos[Global.x])), Global.secondpos[Global.x] + Vector(Empty Array,
							Empty Array, 0.001), Color(Red), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[1] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Good Beam, Global.firstpos[Global.x] + Vector(0.001, Empty Array, Empty Array), Vector(
							X Component Of(Global.firstpos[Global.x]), Y Component Of(Global.secondpos[Global.x]), Z Component Of(
							Global.firstpos[Global.x])), Color(Red), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[2] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Good Beam, Vector(X Component Of(Global.firstpos[Global.x]), Y Component Of(
							Global.secondpos[Global.x]), Z Component Of(Global.firstpos[Global.x])), Global.secondpos[Global.x] + Vector(Empty Array,
							Empty Array, 0.001), Color(Red), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[3] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
					Else;
						Skip(Array(50, 0, 17, 34)[Index Of Array Value(Array(1, 2, 3), Global.g_beamType[Global.x]) + 1]);
						Create Beam Effect(All Players(All Teams), Grapple Beam, Global.firstpos[Global.x], Vector(X Component Of(
							Global.secondpos[Global.x]), Y Component Of(Global.firstpos[Global.x]), Z Component Of(Global.secondpos[Global.x])), Color(
							Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID)];
						Global._arrayBuilder[0] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID)] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Grapple Beam, Vector(X Component Of(Global.secondpos[Global.x]), Y Component Of(
							Global.firstpos[Global.x]), Z Component Of(Global.secondpos[Global.x])), Global.secondpos[Global.x] + Vector(Empty Array,
							Empty Array, 0.001), Color(Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[1] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Grapple Beam, Global.firstpos[Global.x] + Vector(0.001, Empty Array, Empty Array),
							Vector(X Component Of(Global.firstpos[Global.x]), Y Component Of(Global.secondpos[Global.x]), Z Component Of(
							Global.firstpos[Global.x])), Color(Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[2] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Grapple Beam, Vector(X Component Of(Global.firstpos[Global.x]), Y Component Of(
							Global.secondpos[Global.x]), Z Component Of(Global.firstpos[Global.x])), Global.secondpos[Global.x] + Vector(Empty Array,
							Empty Array, 0.001), Color(Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[3] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
						Skip(33);
						Create Beam Effect(All Players(All Teams), Good Beam, Global.firstpos[Global.x], Vector(X Component Of(Global.secondpos[Global.x]),
							Y Component Of(Global.firstpos[Global.x]), Z Component Of(Global.secondpos[Global.x])), Color(Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID)];
						Global._arrayBuilder[0] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID)] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Good Beam, Vector(X Component Of(Global.secondpos[Global.x]), Y Component Of(
							Global.firstpos[Global.x]), Z Component Of(Global.secondpos[Global.x])), Global.secondpos[Global.x] + Vector(Empty Array,
							Empty Array, 0.001), Color(Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[1] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Good Beam, Global.firstpos[Global.x] + Vector(0.001, Empty Array, Empty Array), Vector(
							X Component Of(Global.firstpos[Global.x]), Y Component Of(Global.secondpos[Global.x]), Z Component Of(
							Global.firstpos[Global.x])), Color(Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[2] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Good Beam, Vector(X Component Of(Global.firstpos[Global.x]), Y Component Of(
							Global.secondpos[Global.x]), Z Component Of(Global.firstpos[Global.x])), Global.secondpos[Global.x] + Vector(Empty Array,
							Empty Array, 0.001), Color(Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[3] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
						Skip(16);
						Create Beam Effect(All Players(All Teams), Bad Beam, Global.firstpos[Global.x], Vector(X Component Of(Global.secondpos[Global.x]),
							Y Component Of(Global.firstpos[Global.x]), Z Component Of(Global.secondpos[Global.x])), Color(Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID)];
						Global._arrayBuilder[0] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID)] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Bad Beam, Vector(X Component Of(Global.secondpos[Global.x]), Y Component Of(
							Global.firstpos[Global.x]), Z Component Of(Global.secondpos[Global.x])), Global.secondpos[Global.x] + Vector(Empty Array,
							Empty Array, 0.001), Color(Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[1] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Bad Beam, Global.firstpos[Global.x] + Vector(0.001, Empty Array, Empty Array), Vector(
							X Component Of(Global.firstpos[Global.x]), Y Component Of(Global.secondpos[Global.x]), Z Component Of(
							Global.firstpos[Global.x])), Color(Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[2] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Bad Beam, Vector(X Component Of(Global.firstpos[Global.x]), Y Component Of(
							Global.secondpos[Global.x]), Z Component Of(Global.firstpos[Global.x])), Global.secondpos[Global.x] + Vector(Empty Array,
							Empty Array, 0.001), Color(Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[3] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
					End;
				Else If(
						Global.Wall_ID[Global.x] == 2 || Global.Wall_ID[Global.x] == 4 || Global.Wall_ID[Global.x] == 6 || Global.Wall_ID[Global.x] == 7);
					If(Global.Wall_ID[Global.x] == 6);
						Create Beam Effect(All Players(All Teams), Good Beam, Global.firstpos[Global.x], Global.firstpoint2[Global.x] + Vector(Empty Array,
							Empty Array, 0.001), Color(Red), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID)];
						Global._arrayBuilder[0] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID)] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Good Beam, Global.firstpoint2[Global.x] + Vector(Empty Array, Empty Array, 0.001),
							Global.secondpos[Global.x], Color(Red), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[1] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Good Beam, Global.secondpos[Global.x], Global.secondpoint2[Global.x] + Vector(
							Empty Array, Empty Array, 0.001), Color(Red), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[2] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Good Beam, Global.secondpoint2[Global.x] + Vector(Empty Array, Empty Array, 0.001),
							Global.firstpos[Global.x], Color(Red), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[3] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
					Else;
						Skip(Array(50, 0, 17, 34)[Index Of Array Value(Array(1, 2, 3), Global.g_beamType[Global.x]) + 1]);
						Create Beam Effect(All Players(All Teams), Grapple Beam, Global.firstpos[Global.x], Global.firstpoint2[Global.x] + Vector(
							Empty Array, Empty Array, 0.001), Color(Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID)];
						Global._arrayBuilder[0] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID)] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Grapple Beam, Global.firstpoint2[Global.x] + Vector(Empty Array, Empty Array, 0.001),
							Global.secondpos[Global.x], Color(Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[1] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Grapple Beam, Global.secondpos[Global.x], Global.secondpoint2[Global.x] + Vector(
							Empty Array, Empty Array, 0.001), Color(Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[2] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Grapple Beam, Global.secondpoint2[Global.x] + Vector(Empty Array, Empty Array, 0.001),
							Global.firstpos[Global.x], Color(Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[3] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
						Skip(33);
						Create Beam Effect(All Players(All Teams), Good Beam, Global.firstpos[Global.x], Global.firstpoint2[Global.x] + Vector(Empty Array,
							Empty Array, 0.001), Color(Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID)];
						Global._arrayBuilder[0] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID)] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Good Beam, Global.firstpoint2[Global.x] + Vector(Empty Array, Empty Array, 0.001),
							Global.secondpos[Global.x], Color(Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[1] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Good Beam, Global.secondpos[Global.x], Global.secondpoint2[Global.x] + Vector(
							Empty Array, Empty Array, 0.001), Color(Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[2] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Good Beam, Global.secondpoint2[Global.x] + Vector(Empty Array, Empty Array, 0.001),
							Global.firstpos[Global.x], Color(Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[3] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
						Skip(16);
						Create Beam Effect(All Players(All Teams), Bad Beam, Global.firstpos[Global.x], Global.firstpoint2[Global.x] + Vector(Empty Array,
							Empty Array, 0.001), Color(Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID)];
						Global._arrayBuilder[0] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID)] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Bad Beam, Global.firstpoint2[Global.x] + Vector(Empty Array, Empty Array, 0.001),
							Global.secondpos[Global.x], Color(Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[1] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Bad Beam, Global.secondpos[Global.x], Global.secondpoint2[Global.x] + Vector(
							Empty Array, Empty Array, 0.001), Color(Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[2] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
						Create Beam Effect(All Players(All Teams), Bad Beam, Global.secondpoint2[Global.x] + Vector(Empty Array, Empty Array, 0.001),
							Global.firstpos[Global.x], Color(Aqua), Visible To);
						Global._arrayBuilder = Global.beam_ID[Count Of(Global.beam_ID) - 1];
						Global._arrayBuilder[3] = Last Created Entity;
						Global.beam_ID[Count Of(Global.beam_ID) - 1] = Global._arrayBuilder;
					End;
				End;
				Wait(0.016, Ignore Condition);
			End;
		End;
		Global.initialized = True;
	}
}`
