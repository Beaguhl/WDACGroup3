To see who follows  who in the database, use this information:

followerID is the person who follows publisherID

Jocke has id = 1
Ellen has id = 2

To see everyone that ellen follows: SELECT * FROM Follow WHERE followerID = 2
To see everyone that follows ellen: SELECT * FROM Follow WHERE publisherID = 2