<?php
class Tracker
{
    protected $db;

    function __construct()
    {
        include("Database.php");
        $database = new Database();
        $this->db = $database->connect();
    }

    public function track()
    {
        $jsonData = file_get_contents('php://input');
        $trackingData = json_decode($jsonData);

        $smsSendoutDateTime = date("Y-m-d H:i:s", $trackingData->smsSendoutDateTime);
        $partitipantId = $trackingData->partitipantId;
        $workplace = filter_var($trackingData->workplace, FILTER_VALIDATE_BOOLEAN);
        $workplaceDescription = $trackingData->workplaceDescription;
        $facebook = filter_var($trackingData->facebook, FILTER_VALIDATE_BOOLEAN);
        $facebookDescription = $trackingData->facebookDescription;
        
        
        $trackingStatement = $this->db->prepare("
        INSERT INTO
          trackings
          (
            participantId,
            sendOutTimestamp,
            answerTimestamp,
            hasUsedFacebook,
            whyFacebook,
            hasUsedWorkplace,
            whyWorkplace
          )
        VALUES (
          ?,
          ?,
          NOW(),
          ?,
          ?,
          ?,
          ?
          )
      ");

      $trackingStatement->bind_param('ssssss',
          $partitipantId,
          $smsSendoutDateTime,
          $facebook,
          $facebookDescription,
          $workplace,
          $workplaceDescription
      );
      $trackingStatement->execute();
    }
} 