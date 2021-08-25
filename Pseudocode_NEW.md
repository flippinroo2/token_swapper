# AVA LABS SMART CONTRACT ASSIGNMENT

## PSEUDOCODE

1. Deploy Wrapper contract with 1 argument: "__address owner__" (*the address of the account being used to execute these function calls*).
2. Call the "__createTokenFactory()__" function on the Wrapper contract deployed above.
3. Call "__createToken()__" function __3 times__ on the TokenFactory contract deployed within the function call above. Provide the following arguments:
    1. "__Fuji__", "__FUJI__", __18__, __1100__
    2. "__Haku__", "__HAKU__", __18__, __1050__
    3. "__Tate__", "__TATE__", __18__, __150__
4. Call "__createSwapper()__" function on Wrapper contract providing the following arguments: "__FujiTateSwapper__", __<FUJI_ADDRESS>__, __<TATE_ADDRESS>__
5. Call "__createSwapper()__" function on Wrapper contract providing the following arguments: "__TateHakuSwapper__", __<TATE_ADDRESS>__, __<HAKU_ADDRESS>__
6. Call "__swap()__" function on the 'FujiTateSwapper' Swap contract providing the following argument __100__.
7. Call "__swap()__" function on the 'TateHakuSwapper' Swap contract providing the following argument __50__.
8. Call "__approveFrom()__" function on the 'Fuji' Token providing the following arguments: __<FUJI_ADDRESS>__, __<OWNER_ADDRESS__, __1000__
9. Call "__transferFrom()__" function on the 'Fuji' Token providing the following arguments: __<FUJI_ADDRESS__, __<TOKEN_SUBMISSION_ADDRESS__, __1000__
10. Call "__approveFrom()__" function on the 'Haku' Token providing the following arguments: __<HAKU_ADDRESS>__, __<OWNER_ADDRESS__, __1000__
11. Call "__transferFrom()__" function on the 'Haku' Token providing the following arguments: __<HAKU_ADDRESS>__, __<TOKEN_SUBMISSION_ADDRESS__, __1000__
