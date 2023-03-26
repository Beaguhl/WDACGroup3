To see who follows who in the database, use this information:

followerID is the person who follows publisherID

Jocke has id = 1
Ellen has id = 2

To see everyone that ellen follows: SELECT _ FROM Follows WHERE followerID = 2
To see everyone that follows ellen: SELECT _ FROM Follows WHERE publisherID = 2
