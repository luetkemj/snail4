Create a pile container entity where there are multiple things on the ground. Put all the things into the pile. If it is empty is removed and deleted.

Chests should not become a pile when sorted through but instead all the things that were in it should go back.

Corpses should become piles? Not sure yet. But this fun would be nice to have...

Gold is an entity (item) that happens to not go in your inventory but incremnet your gold stat - like an instant potion...

# Todo

AI

- [ ] Improve AI
- [ ] Monsters pick up things on map if they want them...

UI

- [ ] character tab for player stats
- [ ] display depth in UI
- [ ] HUD should sort items by proximity to player

Combat

- [ ] Weapons should have variable damage
- [ ] Chance to hit
- [ ] minimum damage so a hit can't do 0 damage (should always be some sort of a threat even if it's minimal)

World

- [ ] some variablility to init rendering of dungeon - not static numbers of entities as we currently have

Misc

- [ ] convert wallet to currency on death for monsters
- [ ] food & drink
- [ ] shops

# Bugs

- [ ] items on floor have Wear and Wield actions but you cant actually do them until you pick them up

# Doing

# Done

- [x] money!
- [x] add money to UI somehere
- [x] increment money on currency pickup
- [x] use scribe coinpurse for money counting
- [x] pick up money from chests
- [x] Inventory does not carry through to next level - different player instance per floor! oops! Duh. I'm reinitializing the entire game state. So a brand new player entity. There is literally a different player per floor...
- [x] Multiple dungeon floors
- [x] Only allow ascend and descend when on stairs
- [x] add stair commands to help page
- [x] items in container UI are not sorted
