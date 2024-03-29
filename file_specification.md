**WHOLE SPECIFICATION IS WIP**

# Introduction
The purpose of the `*.rhd` (radar height data) format is to store FFT data returned by the Omnipresence OPS241-B FMCW Radar Sensor over time.
# Specification
## Extension
Files containing data specified in the following section shall have the extension `*.rhd`.
## File
### Header
The header contains information about the file version and the start time of the records. At the moment there is only one version specified, as a result expect `1` as given version. The start time is referenced by the following data records respectively.
|Name|Type|Size (Bytes)|Offset|Description|
|--|--|--|--|--|
|File Signature|string|4|0|File signature is `BERP` for **B**joern **E**. **R**adar **P**roject |
|Version|unsigned int|1|4|Version of the used specification|
|Start|unsigned int|8|5|Recording start time in milliseconds|

### Records
The data record part of the file starts at byte `13` and contains an unlimited number of records. Each record has a length of 2052 bytes and contains an offset and 512 data values of the FFT.

The offset is represented as an unsigned int and used to store the time of recording based on the start time. Using an unsigned int of 4 bytes allows for a theoretical recording time of more the 49 days.

|Name|Type|Size (Bytes)|Offset|Description|
|--|--|--|--|--|
|Offset|unsigned int|4|0|Time offset in milliseconds after starting the recording|
|Data value 1|signed float|4|4|Data value 1 of the FFT|
|...|
|Data value 512|signed float|4|2048|Data value 512 of the FFT|
