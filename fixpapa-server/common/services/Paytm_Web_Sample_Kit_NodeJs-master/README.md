# Installation Steps
 1. The *checksum.js* file contains *genchecksum()* and *verifychecksum()* functions. The merchant module should call these methods with the appropriate set of parameters as mentioned in the API document given [here][link1]
 2. Keep all the files in the folder from where you will be calling the *genchecksum()* and *verifychecksum()* methods. 
 3. The *checksum/pg.js* file contains values for various parameters which need to be configured according to the values received by each merchant.

   [link1]: http://paywithpaytm.com/developer/paytm_api_doc/



# For Offline(Wallet Api) Checksum Utility below are the methods:
  1. genchecksumbystring : For generating the checksum
  2. verifychecksumbystring : For verifing the checksum
