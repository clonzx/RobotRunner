using System.Collections;
using System.Collections.Generic;
using UnityEngine;
namespace UpGS.Creature{
	[RequireComponent(typeof(Rigidbody))]
	public class MovementMotorLite : MonoBehaviour{

	public Animator animator;
	[HideInInspector]
	public Vector3 movementDirection;

		public float walkingSpeed = 3.0f;

		public float RightDirectionMax  = 25.0f;
		public float RightDirectionMin  = 5.0f;
			
		
		public float turningSpeed   = 100.0f;
	
		private bool facingInRightDirection   = false;
		private Quaternion headRotation  = Quaternion.identity;
		private float LastUpdate;
		public Rigidbody rigidBody;
	
		
		void Awake()
		{
			LastUpdate=Time.time;
			//super();
		}
		
		void FixedUpdate () {
			Vector3 adjustedMovementDirection = movementDirection;

			float rotationAngle;
			if (adjustedMovementDirection != Vector3.zero)
				rotationAngle = AngleAroundAxis (transform.forward, adjustedMovementDirection, Vector3.up) * 0.3f;
			else
				rotationAngle = 0;
			Vector3 targetAngularVelocity  = Vector3.up * Mathf.Clamp (rotationAngle, -turningSpeed * Mathf.Deg2Rad, turningSpeed * Mathf.Deg2Rad);
			rigidBody.angularVelocity = Vector3.MoveTowards (rigidBody.angularVelocity, targetAngularVelocity, Time.deltaTime * turningSpeed * Mathf.Deg2Rad * 3);
			
			
			float angle = Vector3.Angle (transform.forward, adjustedMovementDirection);
			if (facingInRightDirection && angle > RightDirectionMax)
				facingInRightDirection = false;
			if (!facingInRightDirection && angle < RightDirectionMin)
				facingInRightDirection = true;
			
			// Handle the movement of the character
			Vector3 targetVelocity ;
			if (facingInRightDirection)
				targetVelocity = transform.forward * walkingSpeed + rigidBody.velocity.y * Vector3.up;
			else
				targetVelocity = rigidBody.velocity.y * Vector3.up;
			
			rigidBody.velocity = Vector3.MoveTowards (rigidBody.velocity, targetVelocity, Time.deltaTime * walkingSpeed * 3);

			
			LastUpdate=Time.time;
			UpdateAnimator();
		}

		// The angle between dirA and dirB around axis
		static float AngleAroundAxis (Vector3 dirA ,Vector3 dirB,Vector3 axis) {
		    // Project A and B onto the plane orthogonal target axis
		    dirA = dirA - Vector3.Project (dirA, axis);
		    dirB = dirB - Vector3.Project (dirB, axis);
		   
		    // Find (positive) angle between A and B
			float angle = Vector3.Angle (dirA, dirB);
		   
		    // Return angle multiplied with 1 or -1
		    return angle * (Vector3.Dot (axis, Vector3.Cross (dirA, dirB)) < 0 ? -1 : 1);
		}

			void UpdateAnimator()
			{
				// update the animator parameters
				//TODO:animator.SetFloat("Fire1", m_Fire1?1f:0f); //clonx 10.02.2018
				var localVelocity = transform.InverseTransformDirection(rigidBody.velocity);
				animator.SetFloat("Forward", localVelocity.z, 0.1f, Time.deltaTime);
				animator.SetFloat("Turn", rigidBody.angularVelocity.y, 0.1f, Time.deltaTime);
			}
		
				
	}
}