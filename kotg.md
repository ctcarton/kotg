# King Of The Galaxy

[tag:king-of-the-hill]

***Sandbox meta note**: This is a very rough draft, mostly in bullet form, intended to solicit feedback on the idea and to decide if it would be worth refining and implementing. It is not the final form of the post. Technical details such as the API and languages supported are TBD. Please comment and tell me what you think.*

This is an RTS inspired KOTH game that pits bots against each other for control of solar systems across the galaxy. It features resource management, fleet combat, and an auction house.

## Map
* 2d map with points ("solar systems", aka "systems") generated at random x,y locations
* unit of distance: ly
* Each player starts with control of a single system

## Resources
* There are 3 resources: [G]old, [M]inerals, and [F]uel
* Each system generates a fixed amount of each resource per turn for the player that controls it
* The amounts produced by each system are randomly generated with the map.
* The total amount of each resource held by the players is tracked globally (not per system)
* The unspent resources held by each player carry over each turn
* There is no maximum on how many resources a player may have

## Actions
Players may take as many actions per turn as they like (and can afford).

#### Build Fighter(s)
* cost: 1M/fighter, upkeep: 1G/fighter/turn thereafter
* fighters are built at a specified system and are located there from the following turn (i.e. it only takes one turn to build)
* upkeep is paid at the beginning of each turn. If the player cannot afford it then the excess fighters (chosen randomly) are automatically scrapped
* the maximum number of fighters that can be built in a system per turn is 2x the [M] production rate of the system

#### Scrap Fighters(s)
* Scrap any number of fighters
* No cost, but no resources recovered

#### Travel
* Players may move any number of fighters from one system to another.
* Cost: 1F/ship/ly, paid upfront
* Travel takes time, 1 turn/ly 
* Fighters that are in transit between systems may not be redirected anywhere. They must arrive before they can be sent elsewhere.
* Fighters in transit can still be scrapped, either explictly or automatically if upkeep is not paid. Players are not refuned travel costs.

#### Auction House - Post Order
* Each player may post to a global "Auction House" one Order per system they control
* Orders are offers to trade one resource for another at a given ratio (e.g. offer 100G for 80M), with a max amount to trade (no minimum)
* When creating an order, the player must possess all resources required to fully complete the order which are then reserved (escrow)
* Players may cancel their posted orders at any time, whereupon remaining escrow resources are refunded
* If a player loses control of a system with an open order then that order is automatically cancelled and escrow resources are refunded.

#### Aution House - Fill Order
* Any player may fill any number of orders for any amount up to the order maximum
* Resources are immediately exchanged at the end of a turn when an order is filled (partially or completely)
* Partially filled orders remain open with the maximum reduced accordingly
* If multiple players attempt to fill the same order they will be resolved by queuing the players randomly. If the order is completely filled with players still queued, the extra fills will be cancelled and refunded.


## Combat
When there are are multiple fighters from different players in the same system at the same time those fighters will automatically engage in combat.

Combat is fully automatic and resolved as follows:
* Each fleet destroys a number of enemy fighters equal to 10% the fleet size.
* This damage is distributed across enemy fleets in proportion to the size of those enemy fleets.

Example:

    Player1: 100 ships
    Player2: 200 ships
    Player3: 500 ships
    
    Player1 destroys 10 ships (100 * 0.1), consisting of:
    	3 of Player2's ships (10 * 200/700)
    	7 of Player3's ships
    		
    Player2 destroys 20 ships (200 * 0.1), consisting of:
    	3 of Player1's ships (20 * 100/600)
    	17 of Player3's ships
    
    Player3 destroys 50 ships (500 * 0.1), consisting of:
    	17 of Player1's ships (50 * 100/300)
    	33 of Player2's ships
    
    Results:
    	Player1: 80 fighters
    	Player2: 164 fighters
    	Player3: 476 fighters

* There is only one combat round per turn per system
* After combat if there is only one player with ships remaining (all other ships destroyed) and that player is not the controller of that system, then the system becomes "Contested"
* Contested systems are still controlled by the original owner (the "Controller"), but income is disabled and ships may not be built there. The system still counts for supporting auction house orders.
* After combat in a Contested system, if the player with the most ships remaining is the Controller, then the system is no longer Contested.
* If three turns in a row pass in a Contested system in which the same player (who is not the Controller) controls the most ships at the end of combat then control flips to that player (they become the Controller) and the system is no longer Contested.
* At the start of the game, all uncontrolled planets start with a small force of "native" unaligned ships which must be defeated before the first player gains control. These systems flip to the control of the player immediately after all native ships are destroyed if there is only one player present. If there is more than one player present then the rules for Contested systems apply

## Winner:
The winner is the player who controls the most systems after X turns

[tag:king-of-the-hill]

