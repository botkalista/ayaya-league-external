

## How to run

1. Enter into a league game
2. `npm run execute`

# Features

- Show player attack range
- Show enemy champions attack range
- Show enemy champions summoner spells cooldown
- Settings window [CTRL + SPACE]


# TODO

- Fix broken pointers
- Fix champ detector (try to use heroList instead of guessing from all entities)


# Media


> HAPPY :3

https://user-images.githubusercontent.com/42075940/182252911-320a0c22-ff5b-41f0-ba82-199e5262ec1a.mp4


# Hints


## AttackableList/HeroList
```

what is "obj_index (= 0x8)" supposed to mean/do?
Is this supposed to be ReClass syntax?

The first data types have a size of 0x4, therefore it is incrementing by 0x4

Leading to this struct (as @CynoCoder told you)

0x0 - vtbl (type: vtbl ptr)
0x4 - list (type: ptr)
0x8 - size (type: int)

The list/vector/array or whatever the fck you wanna call it, contains pointers to all minions (and objects coded as minions), that's why you will see only stuff like "<HEAP> 355164" in red at the of each line. This means that they are pointers.

When you mark them as pointers in reclass you can view the member variables of that object
Attachment 21006

0x54 is the name, which is either a text, or a text ptr. When you look at 0x64 and 0x68 you will the length of the name and the capacity of the name, as in how long it can be.
If the name is <15 characters its type text, if its above its a text ptr. The reason why there is a gap of 0x10 between the name and the length of the name is, to have buffer in case the string is <15 characters long. The same applies to all strings riot as (same at 0x2BA4). There are probably snippets here that you can copy paste and use when reading strings so they are correctly parsed in c++.

Tip:
Create a new class file in ReClass, name it objectlist or something. Make 0x0 an array and type should be pointer.

Now, create classes for each managertemplates (object, hero, minion, turret,... etc) and change the type of their lists from ptr to your new class and you can easily iterate through them, without always clicking on an entry, changing its type to a ptr and then de-/collaping it.
Attachment 21007

Edit:
Correct syntax for ReClass to get what you are looking for is
[[[<League of Legends.exe> + 0x24B7C28] + 0x4] + 0x0] + 0x2BA4

[<League of Legends.exe> + 0x24B7C28] - Minionmanager
[[[<League of Legends.exe> + 0x24B7C28] + 0x4] - Minionmanager list
[[[<League of Legends.exe> + 0x24B7C28] + 0x4] + 0x0] - Minionmanager list at idx 0 (increment by 0x4 for succeeding item, i.e. 0x4 is idx 2, 0x8 is idx 3, etc.)
[[[<League of Legends.exe> + 0x24B7C28] + 0x4] + 0x0] + 0x2BA4 - Minionmanager list at idx 0 with offset 0x2BA4 which is a member variable for a name
```