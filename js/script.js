/*@Author Abul Ehtesham*/

var FRAME_LIMIT =10;
function BowlingGame(){
	
	this.frames = [];
	this.frameNumber = 1;
	this.currentFrame = new Frame(this.frameNumber);
	
	
	/**
	 * Method should be called each time when a player rolls a bowling ball
	 */
	this.roll = function(pinsknocked){
		
		if(this.frameNumber <= FRAME_LIMIT){
			
			if(pinsknocked>=0 && pinsknocked <= this.currentFrame.pinsLeft()){
				
				var roll = new Roll(pinsknocked);
				this.currentFrame.addRoll(roll);
				if(this.currentFrame.rollsLeft ==0){
					this.frames.push(this.currentFrame);
					this.currentFrame = new Frame(++this.frameNumber);
				}
							
			}else{
				alert("Invalid number of pins knocked" + this.currentFrame.pinsLeft());
			}
		}else{
			alert("No more than "+FRAME_LIMIT+" frames in a single bowling game");
		}
	}
	
	/**
	 * Calculates the score for the bowling game
	 */
	this.calculateScore = function(){
		var score =0;
		for(var i=0;i<this.frames.length;i++){
			
			var currentFrame = this.frames[i];
			var nextFrame = this.frames[i+1];
			score+= currentFrame.getTotalPinsKnocked();
					
			if(nextFrame){
				
				if(currentFrame.isStrike()){
					score += nextFrame.getFirstRollKnockDown();
					if(nextFrame.isStrike()){
						score += this.frames[i+2].getFirstRollKnockDown();
					}else
						score += nextFrame.getSecondRollKnockDown();
					
				}else if(currentFrame.isSpare()){
					score+=nextFrame.getFirstRollKnockDown();
				}
				
			}
		}
		return score;
	}
}

/**
 * A class for single frame in the game
 */
function Frame(frameNumber){
	
	this.frameNumber = frameNumber;
	this.rollsCount = 0;
	this.rolls = [];
	this.bonusRollForLast = false;
	this.rollsLeft = 2;
	
	/**
	 * Adds user rolls to the single frame
	 */
	this.addRoll = function(roll){
		this.rolls.push(roll);
		this.rollsCount++;
		if(this.frameNumber == FRAME_LIMIT){
			
			this.rollsLeft--;
			
			if( !this.bobonusRollForLast && (this.isStrike() || this.isSpare()) ){
				this.bonusRollForLast = true;
				this.rollsLeft++;
			}
			
		}else{
			if(this.isStrike())
				this.rollsLeft = 0;
			else
				this.rollsLeft--;
		}
		
	}
	
	/**
	 * Returns the value of pins knocked in the first roll
	 */
	this.getFirstRollKnockDown = function(){
		return this.rolls[0].pinsknocked;
	}
	
	/**
	 * Returns the value of pins knocked for the second roll
	 */
	this.getSecondRollKnockDown = function(){
		if(this.rolls.length>1){
			return this.rolls[1].pinsknocked;
		}else{
			return 0;
		}
	}
	
	/**
	 * Return total pins knocked in the single frame
	 */
	this.getTotalPinsKnocked = function(){
		var total = 0;
		for(var i=0;i<this.rolls.length;i++){
			total+= this.rolls[i].pinsknocked;
		}
		return total;
	}
	
	/**
	 * Total pins left in the single frame<br>
	 * If it is the last frame of the game then the roll can go up to three chances<br>
	 * So for the third chance the pins left will be 10
	 */
	this.pinsLeft = function(){
		
		if(this.frameNumber==FRAME_LIMIT){
			if(this.rollsCount ==0 )
				return 10;
			else if(this.rollsCount ==1){
				if(this.getTotalPinsKnocked()==10){
					return 10;
				}else{
					return ( 10 - this.getTotalPinsKnocked());
				}
			}else{
				return 10;
			}
				
		}else
			return ( 10 - this.getTotalPinsKnocked());
	}
	
	/**
	 * Checks whether current frame is strike hit or not
	 */
	this.isStrike = function(){
		if(this.getTotalPinsKnocked()==10 && this.rollsCount==1){
			return true;
		}else{
			return false;
		}
	}
	
	/**
	 * Checks whether current frame is spare hit or not
	 */
	this.isSpare = function(){
		if(this.getTotalPinsKnocked()==10 && this.rollsCount==2){
			return true;
		}else{
			return false;
		}
	}
	
}

/**
 * A class to hold single instances of roll<br>
 * Each frame other than last frame can hold max two rolls<br>
 * Last frame can hold max three rolls
 */
function Roll(pinsknocked){
	this.pinsknocked = pinsknocked;
}