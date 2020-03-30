# CurveStomp
A project for self-reporting COVID 19 symptoms and resource requirements for those who are
isolated or quarantined 

This project will lay out an initial specification including a transport envelope for API access
for aggregate reporting. It may be more effective for people to manage local instances but we need
central reporting 

The initial implementation will be node.js



# Data model and workflow and any other technical information will be laid out in Wiki 

## Current Status
 * communications management - Slack Chosen
 * hosting - sourced
 * Effort co-ordination with Coronavirus Census Collective

## Screen Shots
 * [Identity & Household Profile](https://raw.githubusercontent.com/CHGLongStone/CurveStomp/master/screenshots/identity_household_profile.jpg)
 * [Location Profile](https://raw.githubusercontent.com/CHGLongStone/CurveStomp/master/screenshots/location_profile.jpg)
 * [Location Profile](https://raw.githubusercontent.com/CHGLongStone/CurveStomp/master/screenshots/location_profile_1_step_out.jpg)
 * [Location Profile](https://raw.githubusercontent.com/CHGLongStone/CurveStomp/master/screenshots/location_profile_2_step_out.jpg)
 * [Location Profile](https://raw.githubusercontent.com/CHGLongStone/CurveStomp/master/screenshots/location_profile_max_step_out.jpg)

## Basic premise(s):
1.  If exponential growth continues, lab-based testing won't keep up with the virus.
2.  Data travels faster than the virus can spread. The problem is collection speed, cost and
    accuracy.
3.  Given that the virus causes symptoms in a percentage of infected, it cannot significantly spread
    within a self-isolating community without causing symptoms to appear.
4.  If sufficient numbers of the public periodically report relevant symptoms within their
    household, the scope of the spread of the virus within the reporting population might become
    evident. To differentiate between a lack of symptoms and a lack of reporting, regular reports
    should be made even if no symptoms are presenting. 
5.  For the reported information to be useful, it must be possible for researchers and
    analysts to correlate the data to geographic areas, and track symptom progression in each
    location over time. To succeed, reports will have to be recurrent (ongoing) and indexed
    by geographic location.
6.  Collected information must not be personally identifying, unless explicitly agreed to by
    the respondent. People shouldn't have to fear 'negative' consequences to their reports - such as
    stigmatization or quarantine, etc. Therefore, a balance must be struck between location
    information sufficient to map the data to geography, but not accurate enough to knock on
    someone's door or identify them from their reports.
7.  A respondent should be able to fill out a report for all members of their household. However, 
    reports themselves should reflect individual information about each household member.
8.  Collected data must be shared in a manner and format which is easy to download, parse and
    analyze by anyone. A recommendation is to publish CSV data on GitHub. Recommendations welcome.
9.  Reports will address the following categories of information: 
    * Identity
        * Every household must be granted a unique identity with which they can re-use to submit
         subsequent reports.
        * household members should be anonymously identified, and optionally classified by age
         and gender.
    * Location 
        *   There is no user-friendly global location standard, and so this is expected to be
            adjusted based on locality of respondents.
        *   Initial suggestion is based on a Country>[Region]>City>Street + Postal Code model 
        *   If there was a way to distill provided information into 1km lat/long grids, without
            asking for pinpoint location information - would be best.
        *   A solution which would work for most countries would be good.
    * Symptom Profile
        *   The list of symptoms to report for should evolve to correspond with known and
            published documentation of the virus. It should also allow for additional input if
            not cost-prohibitive. 
        *   Each symptom should be reported via sliding scale from "not presenting" to "severe".
        *   For ease of use, a catch all 'No Symptoms to Report' option should be offered to
            speed up reporting. 
    * Transmission Profile
        *   Respondents should be asked to self-declare whether they are self-isolating and
            practicing social distancing protocols. 
        *   Respondents should be asked what the maximal distance they've travelled from their
            reported location (or isolation point) has been since they last reported. 
        *   If respondents indicate that they have left isolation, query how many times, and how
            many people (estimate in incrementing ranges of 50 up to 200+) they interacted with.
        *   If respondents indicate they have left isolation, query how many surfaces they've
            touched (estimate). 
10. Forms should be designed with 'drill-down' logic wherever possible, to avoid overwhelming
    respondents with irrelevant questions.
11. A report must be completable in under one minute per person, and faster is better. The
    reporting experience must not be a nuisance.
11. Measures should be employed to detect and screen for false reporting. An example could
    be to store alongside a report's data the country to which its IP address relates. A
    hash of the IP address for each report might be stored as well. In principle, it is better to
    collect information by which such screening can be performed, than perform the screening
    ourselves. This would give analysts the richest possible data sets.
12. If the reporting tool proves successful / useful, there could be millions of reports landing
    a day, so some attention needs to be paid to architecture. To some reasonable extent, I'm
    willing to cover basic costs for hosting and such. But if it gets really massive, we'll have to
     figure out how to deal with it.
13. Social media is probably the best channel from which to launch. On reddit, there's 
    r/coronavirus. There're probably other options on Twitter etc - keep a look out for good 
    launching channels. Be resourceful.
14. Respondents and their data should be organized geographically in a hierarchy of granularity 
    (country, region, etc.), and hopefully can be granular down to clusters of <5000 ppl.
15. Textual content should be reasonably prepped for crowd-sourced translation (if it goes global)
16. There might be justification for additional questions, related - for instance - to supply
    chains. What do people have a lot of, what are people lacking, etc.
17. TIME IS OF THE ESSENCE. The usefulness of such a tool is primarily _before_ a region gets hit
    by an exponential explosion of cases, in mitigation. The window for this is rapidly closing. !!
