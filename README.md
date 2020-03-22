# CurveStomp
a project for self-reporting COVID 19 symptoms and resource requirements for those who are isolated or quarantined 

This project will lay out an initial specification including a transport envelope for API access for aggregate reporting 
It may be more effective for people to manage local instances but we need central reporting 


The initial implementation will be LAMP based, converting this to node.js would be helpful


# Data model and workflow and any other technical information will be laid out in Wiki 

## what we need right now
 * communications management - Slack Chosen
 * hosting - TBD
 * project management/resource coordination
Basic premise(s) [just to get the ball rolling]:

1.  There is no way to ramp up testing to capture a large enough data set from the general public, 
  * so an alternative is needed to shore up the data

2. Data can be aggregated and processed far faster than this - or any - virus can spread. The problem is the collection speed and cost.

3. The virus can't spread without causing symptoms.

4. By asking the public to periodically report on their (household's) symptoms, the data can 'get ahead' of the spread. As symptoms are reported en masse, it will paint a picture of potential spread areas.

5. Symptom reports can only be useful if they track the appearance of symptoms by location - and over time. Therefore there'll have to be a way (TBD) to classify users by location.

6. People won't be as willing to report symptoms if they fear there could be 'negative' ramifications - such as personally identifiable information, which might result in stigmatizing or fear of quarantine, etc. There will have to be a trade off between location information sufficient to map the data to geography, but not accurate enough to knock on someone's door or identify them from their report.

7. A single user should be able to report information about the entire household.

8. Collected data should be shared in a manner which is easy to download, parse and analyze by anyone wishing to do so (suggestions for format / hosting?)

9. I can imagine the following info categories: 
  * Identity 
    * unique household id
    * household members
  * Location 
    * postal code? 
    * address resolving to lat/long grid? 
    * ideally a solution which would work for most countries 
  * Symptoms 
    * a sliding scale from "not presenting" to "severe" for each symptom, 
    * with a catch-all for "no symptoms"? 
  * Drill-down logic to not overwhelm with a large form?], 
  * Transmission 
    * are you self-isolating? 
    * how far have you travelled since your last report? 
    * How many trips? people you've interacted with? 
  *  Again, sliding scales

10. It should take <1m per individual report - preferably less than 40s. It can't be a burden to fill out the data.

11. Basic IP geo-validation should take place, to try to screen cases where people are filling out fake reports. Mostly, people who are self-isolating should be reporting via the same ISP, and probably the same IP - and it should almost always correspond 1:1 with the geographic designation of the IP address (I'm thinking it would be better to allow these reports, and screen later? Should IPs be included in downloadable data? Maybe just mention of the IP's geolocation info?)

12. There could be millions of reports landing a day, so some attention needs to be paid to architecture. To some reasonable extent, I'm willing to fund it. But if it gets really massive, we'll have to figure out how to deal with it (ideas?)

13. Social media is probably the best channel from which to launch. On reddit, there's r/coronavirus. There're probably other options on Twitter etc - keep a look out for good launching channels.

14. Location information should be organized geographically in a hierarchy of granularity (country, region, etc.), and hopefully can be granular down to pockets of <10000 ppl.

15. Textual content should be reasonably prepped for crowd-sourced translation (if it goes global)

16. There might be justification for additional questions, related - for instance - to supply chains. What do people have a lot of, what are people lacking, etc.
